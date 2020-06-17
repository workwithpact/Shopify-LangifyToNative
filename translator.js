const Shopify = require('shopify-api-node');
const fetch = require('node-fetch')

class Translator {
  constructor(config) {
    this.config = config
    this.verbosity = config.verbosity || 4
    console.log('Got called', config)
    this.shopify = new Shopify({
      shopName: config.shop,
      apiKey: config.key,
      password: config.password,
      apiVersion: '2020-04'
    })
  }
  info() {
    if (this.verbosity > 3) {
      console.info.apply(this, arguments)
    }
  }
  log() {
    if (this.verbosity > 2) {
      console.log.apply(this, arguments)
    }
  }
  warn() {
    if (this.verbosity > 1) {
      console.warn.apply(this, arguments)
    }
  }
  error() {
    console.error.apply(this, arguments)
  }
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  async _getMetafields(resource = null, id = null, namespace = null) {
    let params = { limit: 250, namespace: namespace || this.config.langifyId }
    if (resource && id) {
      params.metafield = {
        owner_resource: resource,
        owner_id: id
      }
    }
    const metafields = []
    do {
      const resourceMetafields = await this.shopify.metafield.list(params)
      resourceMetafields.forEach(m => metafields.push(m))
      params = resourceMetafields.nextPageParameters;
    } while (params !== undefined);
    return metafields
  }
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async _migratePage(page, translationKeys) {
    this.info(`[PAGE ${page.id}] ${page.handle} started... ${page.admin_graphql_api_id}`)
    const metafields = await this._getMetafields('page', page.id)
    const translation = {
      title: metafields.filter(v => v.key === 'title').map(v => v.value).find(v => v),
      body_html: metafields.filter(v => v.key === 'content').map(v => v.value).find(v => v),
    }
    const variables = {
      id: page.admin_graphql_api_id,
      translations: []
    }
    Object.keys(translation).filter(v => translationKeys && translationKeys[v] && translation[v]).forEach(v => {
      variables.translations.push({
        key: v,
        locale: this.config.locale,
        value: translation[v],
        translatableContentDigest: translationKeys[v]
      })
    })
    if (!variables.translations.length) {
      return
    }
    
    const response = await this.processTranslations(variables)
  }
  async _migrateArticle(article, translationKeys) {
    this.info(`[ARTICLE ${article.id}] ${article.handle} started... ${article.admin_graphql_api_id}`)
    const metafields = await this._getMetafields('article', article.id)
    const translation = {
      title: metafields.filter(v => v.key === 'title').map(v => v.value).find(v => v),
      body_html: metafields.filter(v => v.key === 'content').map(v => v.value).find(v => v),
      summary_html: metafields.filter(v => v.key === 'excerpt_or_content').map(v => v.value).find(v => v),
    }
    const variables = {
      id: article.admin_graphql_api_id,
      translations: []
    }
    Object.keys(translation).filter(v => translationKeys && translationKeys[v] && translation[v]).forEach(v => {
      variables.translations.push({
        key: v,
        locale: this.config.locale,
        value: translation[v],
        translatableContentDigest: translationKeys[v]
      })
    })
    if (!variables.translations.length) {
      return
    }
    const response = await this.processTranslations(variables)
  }
  async _migrateProduct(product, translationKeys) {
    this.info(`[PRODUCT ${product.id}] ${product.handle} started... ${product.admin_graphql_api_id}`)
    const metafields = await this._getMetafields('product', product.id)
    const translation = {
      title: metafields.filter(v => v.key === 'title').map(v => v.value).find(v => v),
      body_html: metafields.filter(v => v.key === 'description').map(v => v.value).find(v => v),
    }
    const variables = {
      id: product.admin_graphql_api_id,
      translations: []
    }
    Object.keys(translation).filter(v => translationKeys && translationKeys[v] && translation[v]).forEach(v => {
      variables.translations.push({
        key: v,
        locale: this.config.locale,
        value: translation[v],
        translatableContentDigest: translationKeys[v]
      })
    })
    if (!variables.translations.length) {
      return
    }
    const response = await this.processTranslations(variables)
  }
  async _migrateSmartCollection(collection, translationKeys) {
    this.info(`[SMART COLLECTION ${collection.id}] ${collection.handle} started... ${collection.admin_graphql_api_id}`)
    const metafields = await this._getMetafields('smart_collection', collection.id)
    const translation = {
      title: metafields.filter(v => v.key === 'title').map(v => v.value).find(v => v),
      body_html: metafields.filter(v => v.key === 'description').map(v => v.value).find(v => v),
    }
    const variables = {
      id: collection.admin_graphql_api_id,
      translations: []
    }
    Object.keys(translation).filter(v => translationKeys && translationKeys[v] && translation[v]).forEach(v => {
      variables.translations.push({
        key: v,
        locale: this.config.locale,
        value: translation[v],
        translatableContentDigest: translationKeys[v]
      })
    })
    if (!variables.translations.length) {
      return
    }
    const response = await this.processTranslations(variables)
  }
  async _migrateCustomCollection(collection, translationKeys) {
    this.info(`[CUSTOM COLLECTION ${collection.id}] ${collection.handle} started... ${collection.admin_graphql_api_id}`)
    const metafields = await this._getMetafields('custom_collection', collection.id)
    const translation = {
      title: metafields.filter(v => v.key === 'title').map(v => v.value).find(v => v),
      body_html: metafields.filter(v => v.key === 'description').map(v => v.value).find(v => v),
    }
    const variables = {
      id: collection.admin_graphql_api_id,
      translations: []
    }
    Object.keys(translation).filter(v => translationKeys && translationKeys[v] && translation[v]).forEach(v => {
      variables.translations.push({
        key: v,
        locale: this.config.locale,
        value: translation[v],
        translatableContentDigest: translationKeys[v]
      })
    })
    if (!variables.translations.length) {
      return
    }
    const response = await this.processTranslations(variables)
  }
  async graphql(query, variables = {}) {
    const token = this.config.password
    const url = `https://${this.config.shop}.myshopify.com/admin/api/2020-04/graphql.json`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    })
    const data = await response.json()
    data.headers = response.headers
    return data
  }
  async getListTranslations() {
    if (!this._listTranslations) {
      const translatedKeys = await this._getMetafields(null, null, this.config.langifyId)
      this._listTranslations = {}
      translatedKeys.filter(v => v.key.indexOf('li') === 0).forEach(v => {
        const original = v.key.substr(2)
        const translated = v.value
        this._listTranslations[original.toUpperCase()] = translated
      })
    }
    return this._listTranslations
  }
  async getCustomTranslations() {
    if (!this._customTranslations) {
      const translatedKeys = await this._getMetafields(null, null, `${this.config.langifyId}cu`)
      const originalKeys = await this._getMetafields(null, null, `custom`)
      this._customTranslations = {}
      originalKeys.forEach(v => {
        const original = v.value.toUpperCase()
        const translated = translatedKeys.filter(vv => vv.key == v.key.split('ly').join('id')).map(vv => vv.value).find(vv => true)
        this._customTranslations[original] = translated
      })
    }
    return this._customTranslations
  }
  async processTranslations(variables) {
    const customTranslations = await this.getCustomTranslations()
    if (variables && variables.translations && variables.translations.length) {
      variables.translations = variables.translations.map(v => {
        let newValue = `${v.value}`
        Object.keys(customTranslations).forEach(key => {
          if (newValue.indexOf(key.toUpperCase()) >= 0){ 
            console.log('Found a custom match: ', key)
          }
          newValue = newValue.split(key).join(customTranslations[key.toUpperCase()])
        })
        return {
          ...v,
          value: newValue,
        }
      })
    } 
    const query = `
      mutation CreateTranslation($id: ID!, $translations: [TranslationInput!]!) {
        translationsRegister(resourceId: $id, translations: $translations) {
          userErrors {
            message
            field
          }
          translations {
            locale
            key
            value
          }
        }
      }`
    return await this.shopify.graphql(query, variables)
  }
  async getTranslationKeys(type, full = false) {
    let items = []
    let hasNextPage = true
    while (hasNextPage) {
      const query = `
        {
          translatableResources(first:250${ items.length > 0 ? `, after:"${items[items.length - 1].cursor}"` : ''}, resourceType: ${type}) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                resourceId
                translatableContent {
                  key
                  digest
                  locale
                  ${full ? 'value' : ''}
                }
              }
            }
          }
        }
      `
      const data = await this.graphql(query)
      const edges = data && data.data && data.data.translatableResources && data.data.translatableResources.edges || []
      items = items.concat(edges)
      hasNextPage = data && data.data && data.data.translatableResources && data.data.translatableResources.pageInfo && data.data.translatableResources.pageInfo.hasNextPage
      if (!hasNextPage) {
        break
      }
      const cost = (data && data.extensions && data.extensions.cost && data.extensions.cost.actualQueryCost || 1000)
      const waitTime = cost / 100
      this.log(`Got data. Length is now ${items.length}. Sleeping for ${waitTime} seconds.`)
      await this.wait(waitTime * 1000)
    }
    const returnValues = {}
    items.forEach(v => {
      returnValues[v.node.resourceId] = {}
      v.node.translatableContent.forEach(t => returnValues[v.node.resourceId][t.key] = full ? t : t.digest)
    })
    return returnValues
  }
  async migratePages() {
    this.log('Page migration started...')
    let params = { limit: 250 }
    const translationKeys = await this.getTranslationKeys('ONLINE_STORE_PAGE')
    do {
      const pages = await this.shopify.page.list(params)
      await this.asyncForEach(pages, async (page) => {
        await this._migratePage(page, translationKeys[page.admin_graphql_api_id])
      })
      params = pages.nextPageParameters;
    } while (params !== undefined);
    this.log('Page migration finished!')
  }
  async migrateProducts() {
    this.log('Product migration started...')
    let params = { limit: 250 }
    const translationKeys = await this.getTranslationKeys('PRODUCT')
    do {
      const products = await this.shopify.product.list(params)
      await this.asyncForEach(products, async (product) => {
        await this._migrateProduct(product, translationKeys[product.admin_graphql_api_id])
      })
      params = products.nextPageParameters;
    } while (params !== undefined);
    this.log('Product migration finished!')
  }
  async migrateArticles() {
    this.log('Article migration started...')
    const blogParams = {limit: 250}
    const blogs = await this.shopify.blog.list(blogParams)
    const translationKeys = await this.getTranslationKeys('ONLINE_STORE_ARTICLE')
    this.asyncForEach(blogs, async (blog) => {
      let params = { limit: 250 }
      do {
        const articles = await this.shopify.article.list(blog.id, params)
        await this.asyncForEach(articles, async (article) => {
          await this._migrateArticle(article, translationKeys[article.admin_graphql_api_id])
        })
        params = articles.nextPageParameters;
      } while (params !== undefined);
    })
    this.log('Article migration finished!')
  }

  async migrateSmartCollections() {
    this.log('Smart Collection migration started...')
    let params = { limit: 250 }
    const translationKeys = await this.getTranslationKeys('COLLECTION')
    do {
      const collections = await this.shopify.smartCollection.list(params)
      await this.asyncForEach(collections, async (collection) => {
        await this._migrateSmartCollection(collection, translationKeys[collection.admin_graphql_api_id])
      })
      params = collections.nextPageParameters;
    } while (params !== undefined);
    this.log('Smart Collection migration finished!')
  }
  async migrateCustomCollections() {
    this.log('Custom Collection migration started...')
    let params = { limit: 250 }
    const translationKeys = await this.getTranslationKeys('COLLECTION')
    do {
      const collections = await this.shopify.customCollection.list(params)
      await this.asyncForEach(collections, async (collection) => {
        await this._migrateCustomCollection(collection, translationKeys[collection.admin_graphql_api_id])
      })
      params = collections.nextPageParameters;
    } while (params !== undefined);
    this.log('Custom Collection migration finished!')
  }
  async migrateSections() {
    this.log('Sections migration started...')
    const translationKeys = await this.getTranslationKeys('ONLINE_STORE_THEME', true)
    const translations = await this._getMetafields(null, null, `${this.config.langifyId}se_e`)
    await this.asyncForEach(Object.keys(translationKeys), async (theme) => {
      console.log('Theme ', theme)
      const sections = Object.values(translationKeys[theme]).filter(v => v.key.indexOf('section.') === 0)
      const transactions = []
      await this.asyncForEach(translations, (translation) => {
        const parts = translation.value.split('#section#')
        const initialValue = parts.shift()
        const translatedValue = parts.shift()
        const sectionKey = sections.find(v => v.value === initialValue && !transactions.find(vv => vv.key === v.key))
        if (!sectionKey) {
          this.warn('Could not find section with value ', initialValue)
          return
        }
        this.log('Updating', sectionKey)
        if (transactions.find(v => v.key === sectionKey.key)) {
          console.log('Duplicate key found', sectionKey.key)
          return
        }
        transactions.push({
          key: sectionKey.key,
          locale: this.config.locale,
          value: translatedValue,
          translatableContentDigest: sectionKey.digest
        })
      })
      const query = `
        mutation CreateTranslation($id: ID!, $translations: [TranslationInput!]!) {
          translationsRegister(resourceId: $id, translations: $translations) {
            userErrors {
              message
              field
            }
            translations {
              locale
              key
              value
            }
          }
        }`
      const variables = {
        id: theme,
        translations: transactions
      }
      await this.processTranslations(variables)
    })
    this.log('Sections migration finished!')
  }
  async migrateLinks() {
    this.log('Links migration started...')
    const translationKeys = await this.getTranslationKeys('LINK', true)
    const translations = await this.getCustomTranslations()
    const listTranslations = await this.getListTranslations()

    await this.asyncForEach(Object.entries(translationKeys), async ([key, link]) => {
      const transactions = []
      Object.values(link || {}).forEach((linkProperties) => {
        const spaceless = linkProperties.value.split(' ').join('').toUpperCase()
        if (listTranslations[spaceless]) {
          transactions.push({
            key: linkProperties.key,
            locale: this.config.locale,
            value: listTranslations[spaceless.toUpperCase()],
            translatableContentDigest: linkProperties.digest
          })
        }
        else if (translations[linkProperties.value.toUpperCase()]) {
          transactions.push({
            key: linkProperties.key,
            locale: this.config.locale,
            value: translations[linkProperties.value.toUpperCase()],
            translatableContentDigest: linkProperties.digest
          })
        } else {
          this.log(`Could not find appropriate translation for link <${linkProperties.value}>`)
        }
      })
      const variables = {
        id: key,
        translations: transactions
      }
      await this.processTranslations(variables)
    })
    this.log('Links migration finished!')
  }
}

module.exports = Translator