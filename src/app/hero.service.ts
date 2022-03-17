import { Injectable } from '@angular/core';
import { Hero } from './heroes/hero';
import { HEROES } from './heroes/mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';                             // URL a la web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })        // Encabezado de la solicitud de guardado
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }


  // Observables

  getHeroes(): Observable<Hero[]> {
    //this.messageService.add("Listado de heroes");             // Este mensaje aparece al iniciar la aplicación
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('Heroes')),                             // tap() => Mira los valores observables, hace algo con esos valores, y los pasa a la devolución de la llamada "tap()"" no toca los valores en sí mismos.
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // getHeroes(): Observable<Hero[]> {
  //   //this.messageService.add("Listado de heroes");          // Este mensaje aparece al iniciar la aplicación
  //   return of(HEROES);
  // }

  getHero(id: number) {
    // TODO: send the message _after_ fetching the hero
    this.messageService.add(`Heroe localizado: id=${id}`);

    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`Heroe localizado: id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))     // Si el "id" no se encuentra, error 404 (Not Found)
    );
  }

  // Añadir heroe
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`Heroe añadido: id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  // Búsqueda por nombre: 
  searchHeroes(nombre: string): Observable<Hero[]> {
    if (!nombre.trim()) {
      // Si no hay nombre, devuelve un array vacío
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${nombre}`).pipe(
      tap(x => x.length ? this.log(`heroes encontrados: "${nombre}"`) : this.log(`sin resultado: "${nombre}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


  // PUT: Actualizar al heroe en el servidor
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(      // Put: URL, heroe, opciones (definidas arriba)
      tap(_ => this.log(`Heroe actualizado: id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // Eliminar heroe
  deleteHero(hero: Hero): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Heroe eliminado: id=${hero.id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }

  /**
   * Maneja la operación HTTP que falló
   * Permite a la aplicación continuar
   * @param operation - Nombre de la operación fallida
   * @param result - Valor opcional a devolver como resultado observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: Enviar el error a la infraestructura remota del login
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Permite que la aplicación siga ejecutándose al enviar un resultado vacío
      return of(result as T);
    };
  }
}
