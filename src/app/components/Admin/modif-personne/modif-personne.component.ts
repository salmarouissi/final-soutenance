import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-modif-personne',
  templateUrl: './modif-personne.component.html',
  styleUrls: ['./modif-personne.component.css']
})
export class ModifPersonneComponent implements OnInit {
  lesActivites: Activite[] = [];
  lesactivite!: Activite;
  lesequipes!: Activite;
  idActivite!: number;  
  index!: number;  
  id!:number;

  yourFormGroupReference!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private actionSService: ActionSService
  ) { }

  ngOnInit(): void {
    this.idActivite = this.activatedRoute.snapshot.params['id'];
    this.index = this.activatedRoute.snapshot.params['id2'];
    this.id = this.activatedRoute.snapshot.params['id3'];
    console.log();
    

    this.actionSService.getActiviteid(this.idActivite).subscribe(data => {
      this.lesactivite = data;
      console.log(this.lesactivite.equipe[this.index]);
      this.yourFormGroupReference = this.formBuilder.group({
        id:[this.lesactivite.equipe[this.index].id],
        firstName:[this.lesactivite.equipe[this.index].firstName],
        lastName:[this.lesactivite.equipe[this.index].lastName],
        role:[this.lesactivite.equipe[this.index].role],
        image: [this.lesactivite.equipe[this.index].image],
        linkdin:[this.lesactivite.equipe[this.index].linkdin],
    });
    
      
      
    });

    // this.yourFormGroupReference = this.formBuilder.group({
    //   lastName: [''],
    //   firstName: [''],
    //   role: [''],
    //   image: ['assets/images/layout_img/bg1.png'],
    //   linkdin: ['']
      
    // });

    this.afficherAct();
    this.afficherActv();
  }

  afficherAct() {
    this.actionSService.getActiviteid(this.idActivite).subscribe((data) => {
      this.lesactivite = data;
    });
  }

  afficherActv() {
    this.actionSService.getActivite().subscribe((data) => {
      this.lesActivites = data;
    });
  }

  onDetails(id: number) {
    this.router.navigate(['/admin/detailsA/' + id]);
  }

  onSubmit() {
    const formData = this.yourFormGroupReference.value;
  
    // Copie des détails existants du membre
    const existingMembre = { ...this.lesactivite.equipe[this.index] };
  
    // Mettre à jour les détails existants avec les nouvelles données du formulaire
    const updatedMembre = { ...existingMembre, ...formData };
  
    // Mettre à jour le membre dans le tableau d'équipe de l'activité
    this.lesactivite.equipe[this.index] = updatedMembre;
  
    // Mettre à jour l'activité avec l'équipe mise à jour
    this.actionSService.updateActivite(this.idActivite, this.lesactivite).subscribe(() => {
      // Mettre à jour le membre avec les nouvelles données
      this.actionSService.updateMembre(this.lesactivite.equipe[this.index].id, updatedMembre).subscribe(() => {
        // Navigation après la mise à jour réussie
        this.router.navigate(['/admin/detailsA', this.idActivite]);
      }, error => {
        console.error('Erreur lors de la mise à jour du membre :', error);
        // Gérer l'erreur ici si nécessaire
      });
    }, error => {
      console.error('Erreur lors de la mise à jour de l\'activité :', error);
      // Gérer l'erreur ici si nécessaire
    });
  }
  
  
  
  
}