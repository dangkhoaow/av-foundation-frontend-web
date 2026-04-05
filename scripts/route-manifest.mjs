const defaultLocales = ['vi', 'en'];
const staticRouteDefinitions = [
  {
    path: '',
    kind: 'home',
    label: 'Home',
    screenshotKey: 'home',
    readySelectors: ['.hero-with-content'],
  },
  {
    path: '/knowledge',
    kind: 'knowledge',
    label: 'Knowledge',
    screenshotKey: 'knowledge',
    readySelectors: ['.knowledge-page__grid'],
  },
  {
    path: '/who-we-are',
    kind: 'whoWeAre',
    label: 'Who We Are',
    screenshotKey: 'who-we-are',
    readySelectors: ['.who-we-are-page'],
  },
];
const normalizeUrl = (value) => value.replace(/\/$/, '');

const parsePositiveInt = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
const parseLocales = (value) => {
  if (!value) return [...defaultLocales];
  const parsed = value.split(',').map((locale) => locale.trim()).filter(Boolean);
  return parsed.length ? parsed : [...defaultLocales];
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const retryableStatuses = new Set([429, 500, 502, 503, 504]);
export const fetchJson = async (url, attempt = 0) => {
  const response = await fetch(url);
  if (response.ok) return response.json();
  if (retryableStatuses.has(response.status) && attempt < 3) {
    const retryAfter = Number(response.headers.get('retry-after') || '0') * 1000;
    const delay = Math.max(retryAfter, 1000 * (attempt + 1));
    console.warn('[RouteManifest] Retrying request', { url, status: response.status, attempt, delay });
    await sleep(delay);
    return fetchJson(url, attempt + 1);
  }
  throw new Error(`Failed to fetch ${url} (${response.status})`);
};

export const fetchAllPages = async ({ apiUrl, endpoint, limit = 100, cap = null, label = endpoint }) => {
  const results = [];
  let page = 1;

  while (true) {
    const url = new URL(`${apiUrl}${endpoint}`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    const payload = await fetchJson(url.toString());
    const items = payload?.data?.data || [];
    const total = payload?.data?.meta?.total || 0;

    results.push(...items);

    console.info('[RouteManifest] Fetched page', {
      label,
      endpoint,
      page,
      count: items.length,
      total,
    });

    if (items.length === 0) break;
    if (cap && results.length >= cap) break;
    if (!total || page * limit >= total) break;
    page += 1;
  }

  return cap ? results.slice(0, cap) : results;
};

const buildStaticRoutes = (locales) => {
  const routes = [];

  locales.forEach((locale) => {
    staticRouteDefinitions.forEach((definition) => {
      routes.push({
        path: `/${locale}${definition.path}`,
        locale,
        kind: definition.kind,
        label: definition.label,
        screenshotKey: `${locale}/${definition.screenshotKey}`,
        expectedState: 'static',
        readySelectors: definition.readySelectors || [],
        errorSelectors: [],
      });
    });
  });

  return routes;
};

const buildListRoute = ({ locale, kind, label, hasItems, screenshotKey, readySelector, emptySelector }) => ({
  path: `/${locale}/${kind.replace(/Index$/, '').toLowerCase()}`,
  locale,
  kind,
  label,
  screenshotKey: `${locale}/${screenshotKey}`,
  expectedState: hasItems ? 'items' : 'empty',
  readySelectors: hasItems ? [readySelector] : [emptySelector],
  errorSelectors: [],
  hasItems,
});

const buildDetailRoute = ({ locale, kind, label, id, screenshotKey, readySelector, errorSelector, pathPrefix }) => ({
  path: `/${locale}/${pathPrefix}/${id}`,
  locale,
  kind,
  label,
  id,
  screenshotKey: `${locale}/${screenshotKey}`,
  expectedState: 'detail',
  readySelectors: [readySelector],
  errorSelectors: [errorSelector],
});

export const buildRouteManifest = async ({
  apiUrl,
  locales: localeInput = defaultLocales,
  maxArtists = null,
  maxArtworks = null,
  maxEvents = null,
  maxNews = null,
  staticOnly = false,
}) => {
  const normalizedApiUrl = normalizeUrl(apiUrl || '');
  const locales = parseLocales(Array.isArray(localeInput) ? localeInput.join(',') : localeInput);

  if (!normalizedApiUrl) {
    throw new Error('VISUAL_API_URL is required to build the visual manifest.');
  }

  const [artists, artworks, events, news] = staticOnly
    ? [[], [], [], []]
    : await Promise.all([
        fetchAllPages({ apiUrl: normalizedApiUrl, endpoint: '/api/public/artists', limit: 100, cap: maxArtists, label: 'artists' }),
        fetchAllPages({ apiUrl: normalizedApiUrl, endpoint: '/api/public/artworks', limit: 100, cap: maxArtworks, label: 'artworks' }),
        fetchAllPages({ apiUrl: normalizedApiUrl, endpoint: '/api/public/events', limit: 100, cap: maxEvents, label: 'events' }),
        fetchAllPages({ apiUrl: normalizedApiUrl, endpoint: '/api/public/news', limit: 100, cap: maxNews, label: 'news' }),
      ]);

  const routes = buildStaticRoutes(locales);

  if (!staticOnly) {
    locales.forEach((locale) => {
      routes.push(
        buildListRoute({
          locale,
          kind: 'collectionIndex',
          label: 'Collection',
          hasItems: artworks.length > 0,
          screenshotKey: 'collection/index',
          readySelector: '.artwork-card-grid',
          emptySelector: '.collection-page__empty',
        }),
        buildListRoute({
          locale,
          kind: 'artistsIndex',
          label: 'Artists',
          hasItems: artists.length > 0,
          screenshotKey: 'artists/index',
          readySelector: 'a.artist-card',
          emptySelector: '.artists-page__empty',
        }),
        buildListRoute({
          locale,
          kind: 'eventsIndex',
          label: 'Events',
          hasItems: events.length > 0,
          screenshotKey: 'events/index',
          readySelector: '.event-card-link',
          emptySelector: '.events-page__empty',
        }),
        buildListRoute({
          locale,
          kind: 'newsIndex',
          label: 'News',
          hasItems: news.length > 0,
          screenshotKey: 'news/index',
          readySelector: '.news-item-row',
          emptySelector: '.news-page__empty',
        }),
      );

      artists.forEach((artist) => {
        if (!artist?.id) return;
        routes.push(
          buildDetailRoute({
            locale,
            kind: 'artistDetail',
            label: 'Artist detail',
            id: artist.id,
            screenshotKey: `artists/${artist.id}`,
            readySelector: '.artist-detail-page',
            errorSelector: '.artist-detail-error',
            pathPrefix: 'artists',
          })
        );
      });

      artworks.forEach((artwork) => {
        if (!artwork?.id) return;
        routes.push(
          buildDetailRoute({
            locale,
            kind: 'collectionDetail',
            label: 'Collection detail',
            id: artwork.id,
            screenshotKey: `collection/${artwork.id}`,
            readySelector: '.collection-detail-page',
            errorSelector: '.collection-detail-error',
            pathPrefix: 'collection',
          })
        );
      });

      events.forEach((event) => {
        if (!event?.slug) return;
        routes.push({
          path: `/${locale}/events/${event.slug}`,
          locale,
          kind: 'eventDetail',
          label: 'Event detail',
          slug: event.slug,
          screenshotKey: `${locale}/events/${event.slug}`,
          expectedState: 'detail',
          readySelectors: ['.event-detail-page'],
          errorSelectors: ['.event-detail-error'],
        });
      });

      news.forEach((article) => {
        if (!article?.slug) return;
        routes.push({
          path: `/${locale}/news/${article.slug}`,
          locale,
          kind: 'newsDetail',
          label: 'News detail',
          slug: article.slug,
          screenshotKey: `${locale}/news/${article.slug}`,
          expectedState: 'detail',
          readySelectors: ['.news-detail-page'],
          errorSelectors: ['.news-detail-error'],
        });
      });
    });
  }

  const summary = {
    locales,
    artists: artists.length,
    artworks: artworks.length,
    events: events.length,
    news: news.length,
    totalRoutes: routes.length,
  };

  return {
    generatedAt: new Date().toISOString(),
    source: {
      apiUrl: normalizedApiUrl,
      locales,
      caps: {
        artists: parsePositiveInt(maxArtists),
        artworks: parsePositiveInt(maxArtworks),
        events: parsePositiveInt(maxEvents),
        news: parsePositiveInt(maxNews),
      },
      staticOnly,
    },
    summary,
    routes,
  };
};

export const buildPrerenderRoutes = async (options) => {
  const manifest = await buildRouteManifest(options);
  return manifest.routes.map((route) => route.path);
};
