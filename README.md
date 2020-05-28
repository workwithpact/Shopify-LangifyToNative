# Shopify Langify V1 to Native Translations
This tool makes it easy to port over a store's langify v1 data to Shopify's native tooling.

## What it supports
With this tool, you can port over the following resources:
- Products 
- Smart Collections
- Custom Collections 
- Articles
- Pages

## Setting it all up
You'll first need to [create a private app](https://help.shopify.com/en/manual/apps/private-apps#generate-credentials-from-the-shopify-admin "Read Shopify's documentation on how to create a private app"). It needs write access to the store.

Here are the access scopes that will be required:
- Store content like articles, blogs, comments, pages, and redirects
- Products, variants and collections

Then, you will need to create a `.env` file (copy it from `.env.example`) and fill it out with the right api information you will have gathered from the private apps process.
Alternatively, you can simply pass your store, key, password, langify id and locale through command-line arguments.

## Usage
###  Available flags

- `--products` ports over all products' translations
- `--collections` ports over collections' translations
- `--pages` ports over pages' translations
- `--articles` ports over articles' translations
- `--all` will port over everything.


### Examples

- Porting only product: run `yarn start --products`
- Porting only pages: run `yarn start --pages`
- Porting only articles: run `yarn start --articles`
- Porting products & articles: run `yarn start --products --articles`
- Porting products, pages & articles: run `yarn start --products --articles --pages`
- Just port everything you can: run `yarn start --all`

## Issues and bugs
Create a new issue, or issue a new PR on this repo if you've found an issue and would like it fixed.

## License 
MIT. Do whatever you like with this stuff ✌️.
