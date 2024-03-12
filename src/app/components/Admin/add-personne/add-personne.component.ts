import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { Activite } from 'src/app/Class/Activite/activite';
import { Membre } from 'src/app/Class/Membre/membre';
import { Role } from 'src/app/role';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-add-personne',
  templateUrl: './add-personne.component.html',
  styleUrls: ['./add-personne.component.css']
})
export class AddPersonneComponent implements OnInit {
  lesActivites: Activite[] = [];
  lesMembres: Membre[] = [];
  ajoutPersonneForm!: FormGroup;
  lesroles = Object.values(Role);
  lesactivite!: Activite;
  idActivite!: number;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private actionSService: ActionSService) { }

  ngOnInit(): void {
    this.idActivite = this.activatedRoute.snapshot.params['id'];

    this.afficherAct();

    this.ajoutPersonneForm = this.formBuilder.group({
      id: [''],
      nom: [''],
      prenom: [''],
      role: [''],
      img: ['assets/images/layout_img/profile.jpg'],
      linkdin: ['']
    });

    this.actionSService.getActivite().subscribe(data => {
      this.lesActivites = data;
      console.log(this.lesActivites);
    });

    this.actionSService.getMembre().subscribe(data => {
      this.lesMembres = data;
      console.log(this.lesMembres);
    });
  }

  afficherAct() {
    this.actionSService.getActiviteid(this.idActivite).subscribe((data) => {
      this.lesactivite = data;
    });
  }

  onDetails(id: number) {
    this.router.navigate(['/admin/detailsA/' + id]);
  }

  onAddPForm() {

    const lastName = this.ajoutPersonneForm.get('nom')?.value;
    const firstName = this.ajoutPersonneForm.get('prenom')?.value;

    // Vérifier si le membre existe déjà
    const existingMember = this.lesMembres.find(
      member => member.lastName.toLowerCase() === lastName.toLowerCase() && member.firstName.toLowerCase() === firstName.toLowerCase()
    );

    if (existingMember) {
      alert('Le membre existe déjà ');
      // Ajoutez ici le code pour gérer le cas où le membre existe déjà.
      // Par exemple, afficher un message d'erreur à l'utilisateur.
    } else {
      const len = this.lesMembres.length;
      const idNext = len > 0 ? this.lesMembres[len - 1].id + 1 : 1;
      console.log("id", idNext);

      const newPerson = {
        id: idNext,
        lastName: lastName,
        firstName: firstName,
        role: this.ajoutPersonneForm.get('role')?.value,
        image: this.ajoutPersonneForm.get('img')?.value,
        linkdin: this.ajoutPersonneForm.get('linkdin')?.value
      };

      // Ajouter le nouveau membre à l'équipe de l'activité
      this.lesactivite.equipe.push(newPerson);

      // Mettre à jour l'activité via le service
      this.actionSService.updateAct(this.lesactivite)
        .pipe(
          concatMap(() => this.actionSService.addPersonne(newPerson))
        )
        .subscribe(() => {
          // Vous pouvez naviguer vers une autre page ou effectuer d'autres actions nécessaires ici.
          this.router.navigate(['/admin/mainA']);
        });

    }
  }
}
