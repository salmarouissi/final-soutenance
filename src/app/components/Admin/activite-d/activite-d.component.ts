import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { Membre } from 'src/app/Class/Membre/membre';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-activite-d',
  templateUrl: './activite-d.component.html',
  styleUrls: ['./activite-d.component.css']
})
export class ActiviteDComponent implements OnInit {
  idActivite!:number;
  act!:Activite; 

  lesActivites:Activite[]=[];
  lesMembres:Membre[]=[];
 

  constructor(private activatedRoute: ActivatedRoute,private router:Router,private actionSService:ActionSService) { }

  ngOnInit(): void {
    this.idActivite=this.activatedRoute.snapshot.params['id']
    console.log(this.lesActivites);
    this.actionSService.getActivite().subscribe(data=>{
      this.lesActivites=data;
      console.log(this.lesActivites);

    })

    this.activatedRoute.paramMap.subscribe(params => {
      this.idActivite = +params.get('id')!;
      this.afficherActivite();
    });
    
    this.afficherActivite()

    this.actionSService.getMembre().subscribe(data=>{
      this.lesMembres=data;
      console.log(this.lesMembres);      

    })

  }

  afficherActivite() {
    this.actionSService.getActiviteid(this.idActivite).subscribe(data=>this.act=data);
  }



  onAddMembre(){
    this.router.navigate(['/admin/addP/'+this.idActivite]); 
  }

  onDetails(id:number){
    this.router.navigate(['/admin/detailsA/'+id]); 
  }

  onDeleteAct(){
    const confirmation = window.confirm('Are you sure about deleting this activity?');
    if (confirmation) {
      this.actionSService.deleteA(this.idActivite).subscribe(() => {
        alert('This activity has been deleted successfully');
        this.router.navigate(['/admin/mainA']); 
      });
    }
  }

  onDeleteP(index: number): void {
    const confirmation = window.confirm('Are you sure about deleting this person?');
    if (confirmation) {
    if (index >= 0 && index < this.act.equipe.length) {
      const memberId = this.act.equipe[index].id;
      const deletedMember = this.act.equipe.splice(index, 1)[0];
      this.actionSService.updateActivite(this.idActivite, this.act).subscribe(updatedActivite => {});
  
      const memberIndex = this.lesMembres.findIndex(member => member.id === memberId);
  
      if (memberIndex !== -1) {
        this.lesMembres.splice(memberIndex, 1);
        this.actionSService.deleteP(memberId).subscribe(() => {
          alert('This member has been deleted successfully');
          this.router.navigate(['/admin/mainA']);
        });
      }
    }
  }
  }
  


}
