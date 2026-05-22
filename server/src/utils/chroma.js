// Chroma Cloud integration
// Folder: server/src/utils/chroma.js

const { generateEmbedding } = require('./openai');

let chromaClientPromise;
let collectionPromise;
let warnedNotConfigured = false;

function hasRealValue(value, placeholder) {
  return Boolean(value && value.trim() && value !== placeholder);
}

function isChromaConfigured() {
  return (
    hasRealValue(process.env.CHROMA_API_KEY, 'YOUR_API_KEY') &&
    hasRealValue(process.env.CHROMA_TENANT, 'your_chroma_tenant_id') &&
    hasRealValue(process.env.CHROMA_DATABASE, 'your_chroma_database')
  );
}

function warnIfNotConfigured() {
  if (!warnedNotConfigured) {
    console.warn('Chroma is not configured. Set CHROMA_API_KEY, CHROMA_TENANT, and CHROMA_DATABASE to enable vector indexing.');
    warnedNotConfigured = true;
  }
}

async function getChromaClient() {
  if (!isChromaConfigured()) {
    warnIfNotConfigured();
    return null;
  }

  if (!chromaClientPromise) {
    chromaClientPromise = import('chromadb').then(({ CloudClient }) => new CloudClient({
      apiKey: process.env.CHROMA_API_KEY,
      tenant: process.env.CHROMA_TENANT,
      database: process.env.CHROMA_DATABASE,
      host: process.env.CHROMA_HOST || 'api.trychroma.com',
      port: Number(process.env.CHROMA_PORT) || 443
    }));
  }

  return chromaClientPromise;
}

async function getSummariesCollection() {
  const client = await getChromaClient();
  if (!client) return null;

  if (!collectionPromise) {
    collectionPromise = client.getOrCreateCollection({
      name: process.env.CHROMA_COLLECTION || 'summaries',
      embeddingFunction: null,
      metadata: {
        app: 'ai-content-summarizer'
      }
    });
  }

  return collectionPromise;
}

function buildChromaDocument(summary) {
  const keywords = Array.isArray(summary.keywords) ? summary.keywords.join(', ') : '';
  return [
    `Summary: ${summary.generatedSummary || ''}`,
    `Keywords: ${keywords}`,
    `Original: ${(summary.originalContent || '').slice(0, 6000)}`
  ].join('\n');
}

function buildMetadata(summary) {
  return {
    mongoId: String(summary._id),
    userId: String(summary.user),
    summaryLength: summary.summaryLength || 'short',
    keywords: Array.isArray(summary.keywords) ? summary.keywords.join(', ') : '',
    readingTimeOriginal: summary.readingTimeOriginal || 0,
    readingTimeSummary: summary.readingTimeSummary || 0,
    createdAt: summary.createdAt ? new Date(summary.createdAt).toISOString() : new Date().toISOString()
  };
}

async function indexSummaryInChroma(summary) {
  const collection = await getSummariesCollection();
  if (!collection) return false;

  const document = buildChromaDocument(summary);
  const embedding = await generateEmbedding(document);

  await collection.upsert({
    ids: [String(summary._id)],
    embeddings: [embedding],
    documents: [document],
    metadatas: [buildMetadata(summary)]
  });

  return true;
}

async function deleteSummaryFromChroma(summaryId) {
  const collection = await getSummariesCollection();
  if (!collection) return false;

  await collection.delete({ ids: [String(summaryId)] });
  return true;
}

async function searchSummariesInChroma({ userId, query, limit = 20 }) {
  const collection = await getSummariesCollection();
  if (!collection || !query || !query.trim()) return [];

  const embedding = await generateEmbedding(query);
  const result = await collection.query({
    queryEmbeddings: [embedding],
    nResults: limit,
    where: { userId: String(userId) },
    include: ['metadatas', 'documents', 'distances']
  });

  const ids = result.ids?.[0] || [];
  const distances = result.distances?.[0] || [];

  return ids.map((id, index) => ({
    id,
    distance: distances[index]
  }));
}

module.exports = {
  deleteSummaryFromChroma,
  indexSummaryInChroma,
  isChromaConfigured,
  searchSummariesInChroma
};
