const { program } = require('commander');
require('dotenv').config()
const Translator = require('./translator')

program.version('1.0.0');
program
  .option('--all', 'Migrate everything')
  .option('--products', 'Run the translator for products')
  .option('--collections', 'Run the translator for collections')
  .option('--articles', 'Run the translator for articles')
  .option('--blogs', 'Run the translator for blogs')
  .option('--collections', 'Run the translator for collections')
  .option('--pages', 'Run the translator for pages')
  .option('-v, --verbosity', 'Verbosity level. Defaults to 4, as talkative as my MIL.')
  .option('--shop', 'Shopify instance. ex: your-store')
  .option('--key', 'Shopify API key')
  .option('--password', 'Shopify API password')
  .option('--locale', 'Locale to update/create')
  .option('--langify', 'Langify ID to migrate. ex: ly123456')
  .option('-v, --verbosity', 'Verbosity level. Defaults to 4, as talkative as my MIL.')

program.parse(process.argv);

const config = {
  shop: program.shop ||  process.env.SHOPIFY_STORE ,
  key: program.key ||  process.env.SHOPIFY_API_KEY,
  password: program.password || process.env.SHOPIFY_API_PASSWORD,
  locale: program.locale ||  process.env.SHOPIFY_LOCALE,
  langifyId: program.langify || process.env.SHOPIFY_LANGIFY_ID,
  verbosity: (program.verbosity && program.verbosity * 1)|| 4
}
const translator = new Translator(config)

const start = async () => {

  if (program.all || program.pages) {
    await translator.migratePages()
  }
  if (program.all || program.blogs) {
    await translator.migrateBlogs()
  }
  if (program.all || program.articles) {
    await translator.migrateArticles()
  }
  if (program.all || program.products) {
    await translator.migrateProducts()
  }
  if (program.all || program.collections) {
    await translator.migrateSmartCollections()
    await translator.migrateCustomCollections()
  }
}
start()