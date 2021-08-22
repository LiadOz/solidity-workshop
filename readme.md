

# About

TagMe is blockchain powered crowdsourcing platform for tagging images, each
images and description is called a puzzle. Users can either post puzzles for
other users to solve, or solve puzzles from other members. TagMe has a dedicated
currency called Tags. A puzzle issuer can decide how much Tags a puzzle is
worth.
To make the tagging quality high each issuer and solver is given a score, the
issuer scores depends on the number of times they disputed a solution and the
score of solvers is determined by the number of disputes they have.
The Tag currency has two decimals points.


# How to run TagMe

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


## Example Users

You could use the following private addresses as sample users:

-   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
-   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
-   0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
-   0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0
-   0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e


# Presentation Users

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-right" />

<col  class="org-right" />

<col  class="org-right" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Public</th>
<th scope="col" class="org-right">Private</th>
<th scope="col" class="org-right">Reward</th>
<th scope="col" class="org-right">Rating</th>
<th scope="col" class="org-left">Notes</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">2266</td>
<td class="org-right">ff80</td>
<td class="org-right">100</td>
<td class="org-right">10</td>
<td class="org-left">Dogs and cats</td>
</tr>


<tr>
<td class="org-left">79c8</td>
<td class="org-right">690d</td>
<td class="org-right">300</td>
<td class="org-right">80</td>
<td class="org-left">Koala and lizard</td>
</tr>


<tr>
<td class="org-left">93bc</td>
<td class="org-right">365a</td>
<td class="org-right">200</td>
<td class="org-right">82</td>
<td class="org-left">Shirts and pants</td>
</tr>


<tr>
<td class="org-left">44c0</td>
<td class="org-right">4ee0</td>
<td class="org-right">200</td>
<td class="org-right">50</td>
<td class="org-left">Duck and butterfly</td>
</tr>


<tr>
<td class="org-left">44c0</td>
<td class="org-right">4ee0</td>
<td class="org-right">400</td>
<td class="org-right">70</td>
<td class="org-left">Leopard and bulldog</td>
</tr>


<tr>
<td class="org-left">1199</td>
<td class="org-right">656e</td>
<td class="org-right">&#xa0;</td>
<td class="org-right">&#xa0;</td>
<td class="org-left">3/4 dispute user</td>
</tr>
</tbody>
</table>

