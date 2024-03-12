import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { Role } from 'src/app/role';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-add-activities',
  templateUrl: './add-activities.component.html',
  styleUrls: ['./add-activities.component.css']
})
export class AddActivitiesComponent implements OnInit {
  lesActivites: Activite[] = [];
  activityForm!: FormGroup;
  nextId: number = 1;

  constructor(private router: Router, private formBuilder: FormBuilder, private actionSService: ActionSService) { }
  lesroles = Object.values(Role);

  ngOnInit(): void {
    this.activityForm = this.formBuilder.group({
      id: [''],
      name: [''],
      technology: [''],
      description: [''],
      image: ['assets/images/activite/activite.jpg'],
      equipe: this.formBuilder.array([])
    });

    console.log(this.lesActivites);

    this.actionSService.getActivite().subscribe(data => {
      this.lesActivites = data;
      console.log(this.lesActivites);
    });
  }

  public get lesequipes() {
    return this.activityForm.get('equipe') as FormArray;
  }

  onDetails(id: number) {
    this.router.navigate(['/admin/detailsA/' + id]);
  }

  onSubmitForm() {
    const activityName = this.activityForm.get('name')?.value;

    // Vérifier si l'activité existe déjà par le nom
    const existingActivity = this.lesActivites.find(
      activity => activity.name.toLowerCase() === activityName.toLowerCase()
    );

    if (existingActivity) {
      alert('L\'activité existe déjà.');
      // Ajoutez ici le code pour gérer le cas où l'activité existe déjà.
      // Par exemple, afficher un message d'erreur à l'utilisateur.
    } else {
      const idNext = this.lesActivites.length + 1;

      this.activityForm.patchValue({ id: idNext.toString() });

      this.actionSService.addAvtivity(this.activityForm.value as Activite).subscribe(
        data => {
          console.log("Réponse du service:", data);
          alert("Successful addition of the activity");
          this.router.navigate(['/admin/mainA']);
        },
        error => {
          console.error("Erreur lors de l'ajout de l'activité:", error);
          alert("Error when adding the activity. Please check the console for more details");
        }
      );
    }
  }
}
