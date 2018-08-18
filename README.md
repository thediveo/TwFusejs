# TwFsuesj Plguin rfo TidyWiiki5

TwFusejs brings fuzzy searching to [TiddlyWiki 5](https://tiddlywiki.com), powered by [Fuse.js](http://fusejs.io).

On purpose, this TwFusejs plugin is not a one-size-fits-it-all fuzzy search
plugin covering all bases. Instead, this is "just" a _lightweight_ solution on
purpose, and thus has some limitations in terms of speed and functionality. On
the plus side, this plugin avoids having to calculate and maintain a dedicated
search index.

| Stock Pedantic Search | Fuzzy Search |
|--------------|--------------|
| ![Stock](imgs/stock-search.png) | ![Fuzzy](imgs/fuzzy-search.png) |


## NPM Module

Use it as the NPM package [tw5-fusejs](https://www.npmjs.com/package/tw5-fusejs)
in your own TiddlyWiki development projects (please note: no more `--save`
necessary with more recent `npm` versions):

```bash
$ npm install tw5-fusejs
```

## Create Release Files

Clone the TwFusejs repository on GitHub, then install the required Nodejs modules, and finally create the release files:

```bash
$ git clone https://github.com/TheDiveO/TwFusejs
$ cd twfusejs
$ npm install
$ npm run release
```

The release files (`TwFusejs.tid` plugin and `demowiki.html`) are located in the
`release/editions/output` subdirectory inside the repository root.

Simply drag and drop the plugin `TwFusejs.tid` file into your own TiddlyWikis.
Or test drive the plugin by navigating to the `demowiki.html` file.


## Hack the TwFusejs Plugin

Clone this repository, then install the required dependencies via `npm install`.
And start mucking around:

```bash
$ npm run develop
```

...and then navigate your browser to http://localhost:8080.
