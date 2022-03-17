import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../heroes/hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]> | undefined;
  private searchTerms = new Subject<string>();                        // Subject => es tanto una fuente de valores observables como un Observable en sí mismo

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);                                      // Se insertan valores del observable "searchTerms"
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // Tiempo de espera (ms) después de escribir la primera letra en la búsqueda por nombre
      debounceTime(300),

      // Se envía la solicitud sólo si el texto ha cambiado
      distinctUntilChanged(),

      // cada vez que se añade un nuevo carácter, el listado cambia
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}