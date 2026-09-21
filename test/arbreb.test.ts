import { describe, it, expect } from "vitest";
import {
  feuille,
  noeud,
  contenu,
  gauche,
  droite,
  type,
  estNoeud,
  estFeuille,
  aplatir,
  compterFeuilles,
  miroir,
  compterFeuillesT,
  trouver,
  type ArbreB,
  Noeud,
} from "../src/arbreb.js";

describe("Constructeurs, Sélecteurs et Prédicats", () => {
  it("construit et inspecte une feuille valide", () => {
    const f = feuille(42);

    expect(type(f)).toBe("feuille");
    expect(estFeuille(f)).toBe(true);
    expect(estNoeud(f)).toBe(false);
    expect(contenu(f)).toBe(42);
  });

  it("construit et inspecte un nœud valide avec sous-arbres", () => {
    const f1 = feuille("gauche");
    const f2 = feuille("droite");
    const n: Noeud<string> = noeud(f1, f2);

    expect(type(n)).toBe("noeud");
    expect(estNoeud(n)).toBe(true);
    expect(estFeuille(n)).toBe(false);

    expect(contenu(gauche(n) as any)).toBe("gauche");
    expect(contenu(droite(n) as any)).toBe("droite");
  });
});

describe("aplatir", () => {
  it("aplatit une feuille unique en tableau singleton", () => {
    expect(aplatir(feuille(10))).toEqual([10]);
  });

  it("aplatit l'arbre du cours N1(4, N2(6, 5)) dans l'ordre attendu", () => {
    //      N1
    //     /  \
    //    4    N2
    //        /  \
    //       6    5
    const arbre = noeud(feuille(4), noeud(feuille(6), feuille(5)));
    expect(aplatir(arbre)).toEqual([4, 6, 5]);
  });

  it("aplatit un arbre équilibré", () => {
    //        N
    //      /   \
    //     N     N
    //    / \   / \
    //   1   2 3   4
    const arbre = noeud(noeud(feuille(1), feuille(2)), noeud(feuille(3), feuille(4)));
    expect(aplatir(arbre)).toEqual([1, 2, 3, 4]);
  });
});

describe("compterFeuilles", () => {
  // Arbre asymétrique :
  //        N
  //       / \
  //      N   3
  //     / \
  //    1   2
  const arbre = noeud(noeud(feuille(1), feuille(2)), feuille(3));

  describe("compterFeuilles (récursion arborescente directe)", () => {
    it("renvoie 1 pour une feuille seule", () => {
      expect(compterFeuilles(feuille(99))).toBe(1);
    });

    it("compte l'ensemble des feuilles d'un arbre composé", () => {
      expect(compterFeuilles(arbre)).toBe(3);
    });
  });

  describe("compterFeuillesT", () => {
    it("renvoie 1 pour une feuille seule", () => {
      expect(compterFeuillesT(feuille(99))).toBe(1);
    });

    it("compte les feuilles sans boucle infinie et produit le même résultat", () => {
      expect(compterFeuillesT(arbre)).toBe(3);
    });
  });
});

describe("miroir", () => {
  it("laisse une feuille inchangée", () => {
    const f = feuille("x");
    expect(miroir(f)).toEqual(f);
  });

  it("inverse les branches d'un nœud simple", () => {
    const n = noeud(feuille(1), feuille(2));
    const inv = miroir(n);

    expect(aplatir(inv)).toEqual([2, 1]);
  });

  it("inverse l'arborescence complète du cours N1(4, N2(6, 5))", () => {
    //      N1                    N1'
    //     /  \       =>         /   \
    //    4    N2              N2'    4
    //        /  \            /  \
    //       6    5          5    6
    const arbre = noeud(feuille(4), noeud(feuille(6), feuille(5)));
    const arbreMiroir = miroir(arbre);

    expect(aplatir(arbreMiroir)).toEqual([5, 6, 4]);
  });

  it("valide la propriété d'involution : miroir(miroir(A)) == A", () => {
    const arbre = noeud(noeud(feuille("a"), feuille("b")), feuille("c"));
    expect(aplatir(miroir(miroir(arbre)))).toEqual(aplatir(arbre));
  });
});

describe("trouver", () => {
  const arbre = noeud(feuille(10), noeud(feuille(20), feuille(30)));

  it("renvoie immédiatement la valeur si la racine est une feuille valide", () => {
    expect(trouver(feuille(7), (x) => x === 7)).toBe(7);
  });

  it("renvoie la première feuille validant le prédicat (parcours de gauche à droite)", () => {
    // 20 et 30 sont > 15, mais 20 doit être renvoyé car exploré en premier
    expect(trouver(arbre, (x) => x > 15)).toBe(20);
    expect(trouver(arbre, (x) => x === 10)).toBe(10);
    expect(trouver(arbre, (x) => x === 30)).toBe(30);
  });

  it("renvoie null si aucune feuille ne valide le prédicat", () => {
    expect(trouver(arbre, (x) => x > 100)).toBeNull();
  });
});
