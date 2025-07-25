/**
 * Objet de données simulées contenant l'horodatage, la tension, le courant et la puissance.
 *
 * @property {string} timestamp - La date et l'heure actuelles au format ISO.
 * @property {string} voltage - La valeur de tension simulée, allant de 220 à 230 volts, formatée à deux décimales.
 * @property {string} current - La valeur de courant simulée, allant de 0 à 10 ampères, formatée à deux décimales.
 * @property {number} power - La valeur de puissance simulée, calculée comme le produit d'une valeur de tension (220 à 230 volts) et d'une valeur de courant (0 à 10 ampères).
 */
export const simulatedData = {
  // Générer la date ici pour éviter les incohérences
  timestamp: new Date().toISOString(),
  voltage: (220 + Math.random() * 10).toFixed(2),
  current: (Math.random() * 10).toFixed(2),
  power: +(220 + Math.random() * 10) * (Math.random() * 10),
};
