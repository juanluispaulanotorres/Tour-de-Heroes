import { Component, OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // selectedHero?: Hero;                                  // Propiedad (opcional) de tipo "Hero"                        Interfaz definida en el archivo "hero.ts"
  heroes: Hero[] = [];

  constructor(private heroService: HeroService/*, private messageService: MessageService*/) { }

  // mostrar(hero: Hero): void {                           // Método que se aplicará al hacer click sobre cada botón
  //   this.selectedHero = hero;
  // }

  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();      // El servicio "hero.service.ts" me proporciona un array de heroes que almaceno en la propiedad heroes de esta clase
  // }


  // Observable

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  // Añadir heroe

  add(name: string): void {
    name = name.trim();

    if (!name) { 
      return; 
    }

    this.heroService.addHero({ name } as Hero).subscribe(hero => {this.heroes.push(hero);});
  }

  // Eliminar heroe
  delete(hero: Hero) {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();                                                // "Suscribe" es necesario para enviar la solicitud de eliminación al servidor
  }

  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Heroe seleccionado id=${hero.id}`);
  // }

  ngOnInit(): void {
    this.getHeroes();                                                                             // Obtención de los heroes (al iniciar la aplicación)
  }

}
