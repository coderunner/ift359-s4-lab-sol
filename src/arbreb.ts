import { deuxieme, paire, Paire, premier } from "./paire.js";

export interface Feuille<A> {
  readonly type: "feuille";
  readonly contenu: A;
}
export interface Noeud<A> {
  readonly type: "noeud";
  readonly branches: Paire<ArbreB<A>, ArbreB<A>>;
}
export type ArbreB<A> = Noeud<A> | Feuille<A>;

export function feuille<A>(a: A): Feuille<A> {
  return { type: "feuille", contenu: a };
}
export function noeud<A>(gauche: ArbreB<A>, droite: ArbreB<A>): Noeud<A> {
  return { type: "noeud", branches: paire(gauche, droite) };
}

export function contenu<A>(feuille: Feuille<A>): A {
  return feuille.contenu;
}
export function droite<A>(noeud: Noeud<A>): ArbreB<A> {
  return deuxieme(noeud.branches);
}
export function gauche<A>(noeud: Noeud<A>): ArbreB<A> {
  return premier(noeud.branches);
}
export function type<A>(arbre: ArbreB<A>): ArbreB<A>["type"] {
  return arbre.type;
}

export function estNoeud<A>(a: ArbreB<A>): a is Noeud<A> {
  return type(a) === "noeud";
}

export function estFeuille<A>(a: ArbreB<A>): a is Feuille<A> {
  return type(a) === "feuille";
}

export function aplatir<A>(arbre: ArbreB<A>): A[] {
  if (estFeuille(arbre)) {
    return [contenu(arbre)];
  }
  return [...aplatir(gauche(arbre)), ...aplatir(droite(arbre))];
}

/**
 * Retourne le nombre de feuilles.
 * @param arbre
 */
export function compterFeuilles<A>(arbre: ArbreB<A>): number {
  if (estFeuille(arbre)) {
    return 1;
  }
  return compterFeuilles(gauche(arbre)) + compterFeuilles(droite(arbre));
}

/**
 * L'arbre miroir (les branches gauches et droites inversée)
 * @param arbre
 */
export function miroir<A>(arbre: ArbreB<A>): ArbreB<A> {
  if (estFeuille(arbre)) {
    return arbre;
  }
  return noeud(miroir(droite(arbre)), miroir(gauche(arbre)));
}

/**
 * Retourne le nombre de feuilles.
 * @param arbre
 */
export function compterFeuillesT<A>(arbre: ArbreB<A>): number {
  function iter(aVisiter: ArbreB<A>[], acc: number): number {
    if (aVisiter.length === 0) {
      return acc;
    }
    const [courant, ...reste] = aVisiter;
    if (estFeuille(courant)) {
      return iter(reste, acc + 1);
    }
    return iter([gauche(courant), droite(courant), ...reste], acc);
  }
  return iter([arbre], 0);
}

/**
 * Retourne la premiere feuille pour laquelle le prédicat p est vrai (null sinon).
 * @param arbre
 * @param p
 */
export function trouver<A>(arbre: ArbreB<A>, p: (a: A) => boolean): A | null {
  function iter(aVisiter: ArbreB<A>[]): A | null {
    if (aVisiter.length === 0) {
      return null;
    }
    const [courant, ...reste] = aVisiter;
    if (estFeuille(courant)) {
      if (p(contenu(courant))) {
        return contenu(courant);
      }
      return iter(reste);
    }
    return iter([gauche(courant), droite(courant), ...reste]);
  }
  return iter([arbre]);
}
