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

- [Sigurt Bladt Dinesen](https://github.com/Bladtman242) contributed [an example of ECB encryption and decryption](https://github.com/hypesystem/Cryptoflow/pull/5).
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

### Adding a block

One kind of contribution you could make, is adding a block. A block is any kind of cryptographic
construction, or an example of how existing constructions can be used. Usually the examples help
allowing users to play around with data, for example flowing between an encryption and a decryption
block, in order to see and understand their interaction.

The first step to adding a block, is writing the code. Add a new folder in `lib/src` with what will
be the ID of your block. Inside the folder, add a file `block.js`.

You can look at existing blocks like `xor` (`lib/src/xor/block.js`) or `ecb_example`
(`lib/src/ecb_example/block.js`) for examples of how to write a block implementation. The code in
`block.js` should look something like this:

```js
module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "xor",
        name: "xor",
        inputs: ["a", "b"],
        innards: /** some implementation **/
    });
};
```

The `id` field should be the same as the name of the folder, you placed the block in. The `name` field
may be any longer, descriptive name you can give your block. This name will be displayed in the overview
list, among other places.

The `inputs` array is an array of strings, each string being the name of an input variable. Each input
will be rendered as a field that users can interact with and type content into in different encodings.

Finally, the `innards` are the actual implementation of the block. For very basic constructs, we use
simple asynchronous Javascript functions (like in `xor`). In order to be able to inspect the block, however,
you must specify it in our custom innards language (like in `ecb_example`).

If you are trying to get something to work, but struggling with the details, feel free to open a preliminary
[Pull Request](https://github.com/hypesystem/Cryptoflow/compare), or an
[Issue](https://github.com/hypesystem/Cryptoflow/issues/new) with your question.

### Other contributions

Of course all other contributions are welcome, too!

Here are some ideas for what you could contribute with, if you are interested:

- Refactoring the build system, to make it easier to read
- Improving the layouting algorithm for complex block innards to deal better with complex cases
- Writing or modifying documentation to better include new users
- Suggesting a restructuring of the code, to make it easier for new users to find their way around
- Craft a better experience for new users of the system
- Add support for text content in the system, so descriptions can be shown alongside the blocks
- Improve the user interface or design of the site
- Add support for more encodings when viewing or changing values in the system --- for example, big integers could be supported

You should always feel free to ask questions :-)

# License

The project is fully open source, under the ISC license. See [LICENSE.md](LICENSE.md).
