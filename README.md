Cryptoflow
==========

Cryptoflow *will be* a didactic cryptography environment with an emphasis on exploration.
Follow it as it evolves on https://cryptoflow.netlify.com/.

In plain language, it will be a bunch of boxes and lines, put together to form cryptographic
constructs, much like you would find them illustrated in text books. Unlike the textbook
models, however, Cryptoflow models will be explorable: run a construct with some input,
see its output; click the construct to explore its innards, the parts that make it up.

In more academic terms Cryptoflow will be a browser-based data flow programming language
and environment, with a standard library consisting only of the constructs needed to build
modern cryptographic elements.

It is the product of a 7,5 ECTS (quarter of a semester) project at the IT-University of
Copenhagen, and the first version will be ready at the end of 2017. Along with the first
version of the project, a report will be produced. Check that out at [hypesystem/Cryptoflow-report](https://github.com/hypesystem/Cryptoflow-report)

Will the project end at end of semester 2017? I sure hope not! I would love your contributions
and thoughts along the way.

# Contributors

| Author                                  | Supervisor                    |
|-----------------------------------------|-------------------------------|
| Niels Roesen Abildgaard <nroe@itu.dk>   | Søren Debois <debois@itu.dk>  |

## Additional contributions by

- You...?

## Contributing

If you have a question about the project, or if anything is unclear, please feel free
to [open an issue](https://github.com/hypesystem/Cryptoflow/issues/new). I am very open
to all questions at this point of the project.

Right now, a lot of ground work is going on, so it might be slightly hard to contribute
with anything very concrete, but if you let yourself be known, I will be sure to ping you
once anything reviewable exists. I am also very open to pointers towards related research.

One thing you can do, is run the project locally, to see how it works. To do so, clone
the github project to your machine, make sure you have [Node.js](https://nodejs.org/en/)
installed.

First, install the dependencies the project needs:

```
npm i
```

Now, to run the project locally (it will automatically open your default browser, and if
it does not, you can find it on http://localhost:9876/), simply run:

```
npm start
```

`npm start` builds the project into a directory `_site`, then launches a simple static file
serving server. You can run the build script alone with `npm run build`, if you want to. This
is how the project is built for hosting on [Netlify](https://www.netlify.com/)'s static site
hosting service.

# License

The project is fully open source, under the ISC license. See [LICENSE.md](LICENSE.md).
