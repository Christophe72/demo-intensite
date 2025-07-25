"use client";
import Image from "next/image";
// import Eye from "react-icons-kit";
const HeaderLogo = () => {
  return (
    <>
      <header style={styles.header}>
        {/* <Eye icon="eye" size={32} /> */}
        <Image
          src="/globe.svg"
          alt="WebElec.be Logo"
          width={450} // Largeur de l'image
          height={60} // Hauteur de l'image
          style={styles.logo}
        />
        <span style={styles.text}>WebElec.be</span>
      </header>
    </>
  );
};
const styles = {
  /*
  linear-gradient(90deg, #7193f9 0%, #c8fff1 50%, #6687ea 78%)
  */
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Centrer le contenu horizontalement
    padding: "40px 40px",
    backgroundColor: "#000", // Couleur d'arrière-plan
  },
  logo: {
    height: "40px", // Ajustez la taille selon vos besoins
    marginRight: "10px",
  },
  text: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#3e49e4",
  },
};

export default HeaderLogo;
