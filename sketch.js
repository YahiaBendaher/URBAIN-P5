let etoiles = [];
let etoilesFilantes = [];
let nbEtoiles = 800; 
let gratteCiels = [];

class Etoile {
  constructor() {
    
    this.x = random(width);
    this.y = random(height*0.8); 
    
    
    this.tailleCentre = random(0.2, 1.8);
    
    
    this.couleur = color(
      random(170, 255), 
      random(170, 255), 
      random(170, 255)  
    );
    
    
    this.nbFaisceaux = floor(random(9, 17));
    
    
    this.longueursFaisceaux = [];
    
    //  longueurs de faisceaux
    for (let i = 0; i < this.nbFaisceaux; i++) {
      let longueur = random(3,12);
      this.longueursFaisceaux.push(longueur);
    }
    
    
    this.rotation = random(TWO_PI);
  }
  
  dessiner() {
    push(); // Sauvegarde l'état courant
    
    translate(this.x, this.y); 
    rotate(this.rotation);     
    
    // Dessiner les faisceaux
    stroke(this.couleur, this.couleur, this.couleur, 0.1);
    for (let i = 0; i < this.nbFaisceaux; i++) {
      let angle = (TWO_PI / this.nbFaisceaux) * i;
      let longueur = this.longueursFaisceaux[i];
      
      // Dessiner un faisceau
      let xFin = cos(angle) * longueur;
      let yFin = sin(angle) * longueur;
      strokeWeight(0.09);
      line(0, 0, xFin, yFin);
    }
    
    // Dessiner le centre elliptique
    noStroke();
    fill(this.couleur, this.couleur, this.couleur, 1);
    ellipse(0, 0, this.tailleCentre * 2, this.tailleCentre * 1.5); // Centre légèrement elliptique
    
    pop(); // Restaure l'état précédent
  }
}
class EtoileFilante extends Etoile {
  constructor() {
    super(); // Appelle le constructeur de la classe Etoile
    
    this.vitesse = createVector(random(-2, 2), random(-2, 2)); // Déplacement aléatoire
    this.queueLongueur = 20; // Longueur moyenne de la queue
  }

  dessiner() {
    push();
    translate(this.x, this.y);
    
    // Calculer l’angle opposé à la direction de la vitesse
    let angleQueue = atan2(-this.vitesse.y, -this.vitesse.x);

    stroke(this.couleur, 100); // Queue moins visible
    strokeWeight(0.6);
    for (let i = 0; i < this.nbFaisceaux; i++) {
      let angleVar = random(-0.3, 0.3); // un peu de variation
      let longueur = random(this.queueLongueur / 2, this.queueLongueur);
      let xFin = cos(angleQueue + angleVar) * longueur;
      let yFin = sin(angleQueue + angleVar) * longueur;
      line(0, 0, xFin, yFin);
    }

    noStroke();
    fill(this.couleur);
    ellipse(0, 0, this.tailleCentre * 2, this.tailleCentre * 1.5);
    pop();
  }

  deplacer() {
    this.x += this.vitesse.x;
    this.y += this.vitesse.y;

    // Si l’étoile sort de l’écran, on la remet de l'autre côté
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.x = random(width);
      this.y = random(height * 0.5);
      this.vitesse = createVector(random(-2, 2), random(-2, 2));
    }
  }
}

class GratteCiel {
  constructor(x, largeur, hauteur) {
    this.x = x;
    this.largeur = largeur;
    this.hauteur = hauteur;

    this.largeurFenetre = 10;
    this.espacementFenetre = 4;

    this.nbFenetresLargeur = floor((this.largeur - this.espacementFenetre) / (this.largeurFenetre + this.espacementFenetre));
    this.hauteurEtage = 15;
    this.espacementEtage = 5;
    this.nbEtages = floor((this.hauteur - this.espacementEtage) / (this.hauteurEtage + this.espacementEtage));

    this.fenetres = [];
    this.couleursFenetresEteintes = []; // Tableau pour stocker les couleurs des fenêtres éteintes
    
    for(let etage = 0; etage < this.nbEtages; etage++) {
      let etageTab = [];
      let couleurEtageTab = [];
      
      for(let fenetre = 0; fenetre < this.nbFenetresLargeur; fenetre++) {
        etageTab.push(random() < 0.4); // 40% des fenêtres sont allumées
        // Créer une couleur aléatoire pour chaque fenêtre éteinte
        couleurEtageTab.push(color(random(70, 120), random(70, 120), random(10, 40)));
      }
      
      this.fenetres.push(etageTab);
      this.couleursFenetresEteintes.push(couleurEtageTab);
    }
    
    
    this.couleurBatiment = color(220, 220, 50);
    this.couleurFenetreAllumee = color(255, 255, 0);
  }

  dessiner() {
    fill(this.couleurBatiment);
    rect(this.x, height - this.hauteur, this.largeur, this.hauteur);
    
    for(let etage = 0; etage < this.nbEtages; etage++) {
      for(let fenetre = 0; fenetre < this.nbFenetresLargeur; fenetre++) {
        let fenetreX = this.x + this.espacementFenetre + fenetre * (this.largeurFenetre + this.espacementFenetre);
        let fenetreY = height - this.hauteur + this.espacementEtage + etage * (this.hauteurEtage + this.espacementEtage);
        
        if(this.fenetres[etage][fenetre]) {
          fill(this.couleurFenetreAllumee);
        } else {
          // Utiliser la couleur aléatoire pré-calculée pour cette fenêtre
          fill(this.couleursFenetresEteintes[etage][fenetre]);
        }
        
        rect(fenetreX, fenetreY, this.largeurFenetre, this.hauteurEtage);
      }
    }
  }
  
  
  verifClicFenetre(x, y) {
    for(let etage = 0; etage < this.nbEtages; etage++) {
      for(let fenetre = 0; fenetre < this.nbFenetresLargeur; fenetre++) {
        let fenetreX = this.x + this.espacementFenetre + fenetre * (this.largeurFenetre + this.espacementFenetre);
        let fenetreY = height - this.hauteur + this.espacementEtage + etage * (this.hauteurEtage + this.espacementEtage);
        
        // Vérifier si le clic est dans la fenêtre
        if (x >= fenetreX && x <= fenetreX + this.largeurFenetre && 
            y >= fenetreY && y <= fenetreY + this.hauteurEtage) {
          
          // Inverser l'état de la fenêtre (allumée <-> éteinte)
          this.fenetres[etage][fenetre] = !this.fenetres[etage][fenetre];
          
          
          return true;
        }
      }
    }
    // Aucune fenêtre n'a été cliquée
    return false;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < nbEtoiles; i++) {
    etoiles.push(new Etoile());
  }

  // Ajouter quelques étoiles filantes
  for (let i = 0; i < 5; i++) {
    etoilesFilantes.push(new EtoileFilante());
  }

  creerGratteCiels();
}

function creerGratteCiels() {
  gratteCiels = [];
  
  
  let posX = 0;
  
  
  let espacement = 10; 
  
  
  while (posX < width-15) {
    let largeur = random(60, 120);
    let hauteur = random(height * 0.2, height * 0.8);
    
    let gratteCiel = new GratteCiel(posX, largeur, hauteur);
    gratteCiels.push(gratteCiel);
    
    
    posX += largeur + espacement;
  }
}

function draw() {
  
  background(0, 15, 30);

  for (let i = 0; i < etoiles.length; i++) {
    etoiles[i].dessiner();
  }

  for (let i = 0; i < etoilesFilantes.length; i++) {
    etoilesFilantes[i].dessiner();
    etoilesFilantes[i].deplacer();
  }

  for (let i = 0; i < gratteCiels.length; i++) {
    gratteCiels[i].dessiner();
  }
}

function mousePressed() {
  
  for(let i = 0; i < gratteCiels.length; i++) {

    if(gratteCiels[i].verifClicFenetre(mouseX, mouseY)) {
      return;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  creerGratteCiels();
}