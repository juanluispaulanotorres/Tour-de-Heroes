import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Hero } from '../heroes/hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero?: Hero;                                                          // @Input se usa para recibir datos de un componente

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location                                                   // "Location" es necesario para poder retroceder en la navegación (ejemplo del método "goBack()")
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));                   // Obtengo el id de la ruta y lo almaceno en una variable
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  // save(): void {
  //   this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  // }

}
