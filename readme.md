
# Table of Contents

1.  [TagMe](#org900d88b)
    1.  [About](#org15b59f1)
    2.  [How to run TagMe](#org05e8afb)
        1.  [Example Users](#orgbb42416)


<a id="org900d88b"></a>

# TagMe


<a id="org15b59f1"></a>

## About

TagMe is blockchain powered crowdsourcing platform for tagging images, each
images and description is called a puzzle. Users can either post puzzles for
other users to solve, or solve puzzles from other members. TagMe has a dedicated
currency called Tags. A puzzle issuer can decide how much Tags a puzzle is
worth.
To make the tagging quality high each issuer and solver is given a score, the
issuer scores depends on the number of times they disputed a solution and the
score of solvers is determined by the number of disputes they have.


<a id="org05e8afb"></a>

## How to run TagMe

Open a terminal in the root folder and run:

    npm install .
    npx hardhat compile
    npx hardhat node

Open an additional terminal and from the root folder run:

    npx hardhat run scripts/setup.js --network localhost
    node index.js

The first command will return the contract address which should be
0x5FbDB2315678afecb367f032d93F642f64180aa3, use this address in metamask to add
the Tag currency.

On your favorite browser go to localhost:3000 and start using the site.


<a id="orgbb42416"></a>

### Example Users

You could use the following private addresses as sample users:

-   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
-   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
-   0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
-   0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0
-   0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e

