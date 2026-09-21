import { deuxieme, paire, Paire, premier } from "./paire.js";

export type Liste<A> = Paire<A, Liste<A>> | null;

export function liste<A>(tete: A, reste: Liste<A>): Liste<A> {
  return paire(tete, reste);
}

export function tete<A>(liste: Paire<A, Liste<A>>): A;
export function tete<A>(liste: Liste<A>): A | null;
export function tete<A>(liste: Liste<A>): A | null {
  return liste ? premier(liste) : null;
}

export function reste<A>(liste: Liste<A>): Liste<A> {
  return liste ? deuxieme(liste) : null;
}

export function vide<A>(liste: Liste<A>): liste is null {
  return liste === null;
}

export function longueur<A>(liste: Liste<A>): number {
  function iter(liste: Liste<A>, acc: number) {
    if (vide(liste)) {
      return acc;
    }
    return iter(reste(liste), acc + 1);
  }
  return iter(liste, 0);
}

export function concat<A>(l1: Liste<A>, l2: Liste<A>): Liste<A> {
  if (vide(l1)) {
    return l2;
  }
  return liste(tete(l1), concat(reste(l1), l2));
}

export function inverse<A>(l: Liste<A>): Liste<A> {
  function iter(l1: Liste<A>, acc: Liste<A>): Liste<A> {
    if (vide(l1)) {
      return acc;
    }
    return iter(reste(l1), liste(tete(l1), acc));
  }
  return iter(l, null);
}

/**
 * Fonction qui retourne true si le prédicat est vrai pour au moins un élément de la liste.
 *
 * @param l liste
 * @param p prédicat à appliquer
 */
export function contient<A>(l: Liste<A>, p: (a: A) => boolean): boolean {
  if (vide(l)) {
    return false;
  }
  if (p(tete(l))) {
    return true;
  }
  return contient(reste(l), p);
}

/**
 * Fonction qui retourne compte le nombre d'occurences ou le prédicat p est vrai dans la liste.
 *
 * @param l liste
 * @param p prédicat à appliquer
 */
export function compterOcc<A>(l: Liste<A>, p: (a: A) => boolean): number {
  if (vide(l)) {
    return 0;
  }
  return p(tete(l)) ? 1 + compterOcc(reste(l), p) : compterOcc(reste(l), p);
}

/**
 * Fonction qui retourne compte le nombre d'occurences ou le prédicat p est vrai dans la liste.
 *
 * @param l liste
 * @param p prédicat à appliquer
 */
export function compterOccT<A>(l: Liste<A>, p: (a: A) => boolean): number {
  function iter(courante: Liste<A>, acc: number): number {
    if (vide(courante)) {
      return acc;
    }
    return iter(reste(courante), acc + (p(tete(courante)) ? 1 : 0));
  }
  return iter(l, 0);
}

/**
 * Fonction qui retourne la liste filtrée.
 * Cette liste filtrée contient seulement les éléments qui satisfont le prédicat p.
 * Cette fonction conserve l'ordre des éléments de la liste.
 *
 * @param l liste
 * @param p prédicat à appliquer
 */
export function filtrer<A>(l: Liste<A>, p: (a: A) => boolean): Liste<A> {
  function iter(courante: Liste<A>, acc: Liste<A>): Liste<A> {
    if (vide(courante)) {
      return acc;
    }
    const nouveauAcc = p(tete(courante)) ? liste(tete(courante), acc) : acc;
    return iter(reste(courante), nouveauAcc);
  }
  return inverse(iter(l, null));
}
