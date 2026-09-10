import {
  Collection,
  Topic,
  TopicItem,
  SystemDeck,
  TopicFilterState,
  DeckFilterState,
  TopicMetricsSummary,
} from './types';

/**
 * Builds a hierarchical tree from a flat list of topics
 */
export function buildTopicTree(topics: Topic[], parentId?: string): Topic[] {
  return topics
    .filter((t) => t.parentId === parentId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((parent) => ({
      ...parent,
      children: buildTopicTree(topics, parent.id),
    }));
}

/**
 * Calculates operational metrics for the high-density ribbon
 */
export function computeTopicMetrics(
  collections: Collection[],
  topics: Topic[],
  items: TopicItem[],
  decks: SystemDeck[]
): TopicMetricsSummary {
  const activeCollections = collections.filter((c) => c.status === 'published').length;
  const parentTopics = topics.filter((t) => !t.parentId);
  const subtopics = topics.filter((t) => !!t.parentId);
  const publishedWords = items.filter((i) => i.status === 'published').length;
  const wordsWithAudioOrImage = items.filter((i) => !!i.audioUrl || !!i.imageUrl).length;
  const totalLearners = decks.reduce((acc, d) => acc + d.activeLearners, 0);

  const audioVisualCoveragePercent =
    items.length > 0
      ? Math.round((wordsWithAudioOrImage / items.length) * 1000) / 10
      : 0;

  return {
    totalCollections: collections.length,
    activeCollections,
    totalTopics: parentTopics.length,
    totalSubtopics: subtopics.length,
    totalCuratedWords: items.length,
    publishedWords,
    totalSystemDecks: decks.length,
    activeLearnersOnDecks: totalLearners,
    audioVisualCoveragePercent,
  };
}

/**
 * Filters TopicItems based on current topic, search query, CEFR, status, and part of speech
 */
export function filterTopicItems(
  items: TopicItem[],
  selectedTopicId: string | undefined,
  filter: TopicFilterState
): TopicItem[] {
  return items.filter((item) => {
    // Topic filtering
    if (selectedTopicId && selectedTopicId !== 'all' && item.topicId !== selectedTopicId) {
      return false;
    }

    // Search query (word, phonetic, definition, tags)
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchWord = item.word.toLowerCase().includes(q);
      const matchPhonetic = item.phonetic.toLowerCase().includes(q);
      const matchDefVi = item.definitionVi.toLowerCase().includes(q);
      const matchDefEn = item.definitionEn?.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchWord && !matchPhonetic && !matchDefVi && !matchDefEn && !matchTag) {
        return false;
      }
    }

    // CEFR filter
    if (filter.cefrLevel !== 'all' && item.cefr !== filter.cefrLevel) {
      return false;
    }

    // Status filter
    if (filter.status !== 'all' && item.status !== filter.status) {
      return false;
    }

    // Part of speech filter
    if (filter.partOfSpeech !== 'all' && item.partOfSpeech !== filter.partOfSpeech) {
      return false;
    }

    return true;
  });
}

/**
 * Filters System Decks based on search query, card template, CEFR, and status
 */
export function filterSystemDecks(
  decks: SystemDeck[],
  filter: DeckFilterState
): SystemDeck[] {
  return decks.filter((deck) => {
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchTitle = deck.title.toLowerCase().includes(q);
      const matchTitleVi = deck.titleVi.toLowerCase().includes(q);
      const matchDesc = deck.description.toLowerCase().includes(q);
      const matchTemplate = deck.templateName.toLowerCase().includes(q);

      if (!matchTitle && !matchTitleVi && !matchDesc && !matchTemplate) {
        return false;
      }
    }

    if (filter.templateId !== 'all' && deck.templateId !== filter.templateId) {
      return false;
    }

    if (filter.targetCefr !== 'all' && deck.targetCefr !== filter.targetCefr) {
      return false;
    }

    if (filter.status !== 'all' && deck.status !== filter.status) {
      return false;
    }

    return true;
  });
}
