import { describe, it, expect } from "vitest";
import {
  liste,
  tete,
  reste,
  vide,
  longueur,
  concat,
  inverse,
  contient,
  compterOcc,
  compterOccT,
  filtrer,
  type Liste,
} from "../src/liste.js";

describe("liste, vide, tete, reste", () => {
  it("construit un maillon valide et extrait tete et reste", () => {
    const l = liste(42, null);
    expect(vide(l)).toBe(false);
    expect(tete(l)).toBe(42);
    expect(reste(l)).toBeNull();
  });

  it("gère correctement la liste vide (null)", () => {
    const lVide: Liste<number> = null;
    expect(vide(lVide)).toBe(true);
    expect(tete(lVide)).toBeNull();
    expect(reste(lVide)).toBeNull();
  });

  it("permet l'imbrication séquentielle de plusieurs éléments", () => {
    const l = liste(10, liste(20, liste(30, null)));
    expect(tete(l)).toBe(10);
    expect(tete(reste(l)!)).toBe(20);
    expect(tete(reste(reste(l)!)!)).toBe(30);
    expect(reste(reste(reste(l)!)!)).toBeNull();
  });
});

describe("longueur, concat, inverse", () => {
  describe("longueur", () => {
    it("renvoie 0 pour une liste vide", () => {
      expect(longueur(null)).toBe(0);
    });

    it("calcule la taille exacte d'une séquence", () => {
      const l = creerListe(1, 2, 3, 4, 5);
      expect(longueur(l)).toBe(5);
    });
  });

  describe("concat", () => {
    it("concatène deux listes non vides en préservant l'ordre", () => {
      const l1 = creerListe(1, 2);
      const l2 = creerListe(3, 4);
      const res = concat(l1, l2);
      expect(versTableau(res)).toEqual([1, 2, 3, 4]);
    });

    it("gère les cas limites où l'une des deux listes est vide", () => {
      const l = creerListe("a", "b");
      expect(versTableau(concat(null, l))).toEqual(["a", "b"]);
      expect(versTableau(concat(l, null))).toEqual(["a", "b"]);
      expect(concat(null, null)).toBeNull();
    });
  });

  describe("inverse", () => {
    it("renvoie null pour une liste vide", () => {
      expect(inverse(null)).toBeNull();
    });

    it("inverse l'ordre des éléments", () => {
      const l = creerListe(1, 2, 3);
      expect(versTableau(inverse(l))).toEqual([3, 2, 1]);
    });

    it("respecte la propriété d'involution : inverse(inverse(l)) == l", () => {
      const l = creerListe("x", "y", "z");
      expect(versTableau(inverse(inverse(l)))).toEqual(["x", "y", "z"]);
    });
  });
});

describe("Fonctions d'exercices", () => {
  const listeTest = creerListe(10, 25, 30, 25, 40);

  describe("contient", () => {
    it("renvoie true dès qu'au moins un élément vérifie le prédicat", () => {
      expect(contient(listeTest, (x) => x === 30)).toBe(true);
      expect(contient(listeTest, (x) => x > 35)).toBe(true);
    });

    it("renvoie false si aucun élément ne vérifie le prédicat", () => {
      expect(contient(listeTest, (x) => x === 999)).toBe(false);
      expect(contient(listeTest, (x) => x < 0)).toBe(false);
    });

    it("renvoie false sur une liste vide", () => {
      expect(contient(null, (x) => x === 10)).toBe(false);
    });
  });

  describe("compterOcc", () => {
    it("compte les occurrences", () => {
      expect(compterOcc(listeTest, (x) => x === 25)).toBe(2);
      expect(compterOcc(listeTest, (x) => x > 20)).toBe(4);
    });

    it("renvoie 0 si l'élément est absent ou si la liste est vide", () => {
      expect(compterOcc(listeTest, (x) => x === 100)).toBe(0);
      expect(compterOcc(null, (x) => x === 25)).toBe(0);
    });
  });

  describe("compterOccT", () => {
    it("compte les occurrences", () => {
      expect(compterOccT(listeTest, (x) => x === 25)).toBe(2);
      expect(compterOccT(listeTest, (x) => x > 20)).toBe(4);
    });

    it("renvoie 0 si l'élément est absent ou si la liste est vide", () => {
      expect(compterOccT(listeTest, (x) => x === 100)).toBe(0);
      expect(compterOccT(null, (x) => x === 25)).toBe(0);
    });
  });

  describe("filtrer", () => {
    it("ne retient que les éléments validant le prédicat", () => {
      const res = filtrer(listeTest, (x) => x > 20);
      expect(versTableau(res)).toEqual([25, 30, 25, 40]);
    });

    it("préserve strictement l'ordre d'origine des éléments", () => {
      const nombres = creerListe(1, 2, 3, 4, 5, 6);
      const pairs = filtrer(nombres, (x) => x % 2 === 0);
      expect(versTableau(pairs)).toEqual([2, 4, 6]);
    });

    it("renvoie null si aucun élément ne correspond", () => {
      const res = filtrer(listeTest, (x) => x < 0);
      expect(vide(res)).toBe(true);
    });

    it("renvoie null si la liste d'origine est vide", () => {
      const res = filtrer(null, (x: number) => x > 0);
      expect(vide(res)).toBe(true);
    });
  });
});

function creerListe<A>(...elements: A[]): Liste<A> {
  return elements.reduceRight<Liste<A>>((acc, val) => liste(val, acc), null);
}

function versTableau<A>(l: Liste<A>): A[] {
  const tab: A[] = [];
  let cur = l;
  while (!vide(cur)) {
    tab.push(tete(cur));
    cur = reste(cur);
  }
  return tab;
}
