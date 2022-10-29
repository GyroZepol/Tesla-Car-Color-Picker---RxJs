import { fromEvent, switchMap, throttleTime, of, filter, map, interval, Observable, Subject, BehaviorSubject } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import'./styles/main.scss'

/* 
    Funcion principal
*/
(function(){

    /*
    *Capturando el boton
    */
   const block: HTMLElement = document.querySelector('.block')
   const button = document.querySelector('.btn-main')

   button.addEventListener('click', () => {
        block.style.backgroundColor = 'blue'
   })


   //RXjs

   const observableButton$ = fromEvent(button, 'click')
   observableButton$
   .pipe(
        throttleTime(500)
   )
   .subscribe(() => {
    console.log('hacemos uso del agua')
   })

   // =========== SOURCE ============
   
   const dattaHTTP$ = fromFetch('https://jsonplaceholder.typicode.com/todos')
   dattaHTTP$
   .pipe(
    switchMap((resp:any) => {
        return resp.ok 
             ? resp.json() 
             : of({message:'Error con la peticion'})
    })
   )
   .subscribe(resp => {
    console.log(resp)
   })

   //======== PIPE ===========

   const calentarAgua = (aguaFria:string) => {
    return aguaFria.toUpperCase()
   }

   of('agua','agua','agua','mugre','agua')
   .pipe(
    filter((aguaSinFiltrar) => aguaSinFiltrar === 'agua'),
    map(aguaFiltrada => calentarAgua(aguaFiltrada))
   )
   .subscribe((aguaFiltrada) => console.log(aguaFiltrada))

    //================= UNSUSCRIBE ============================

    const intervalo = interval(1000).pipe(map(() => "agua"))

    const subscribirIntervalo = intervalo.subscribe((agua) =>{
        console.log(`Ya puedes beber ${agua}`)
        subscribirIntervalo.unsubscribe()
    })


    //======= OBSERVABLE =/= OBSERVER ===========
    
    /**
     * OBSERVABLES: of, fromEvent, fromFetch funcion que se encarga de capturar
     * los datos y poder emitir una vez o multiples ves
     * 
     * 
     * Observer: es un objeto que tiene 3 metodos por defecto
     * next, complete, error
     * El observer es la parte que captura los datos
     * 
     *
    */

    const miObservable = new Observable((observer) => {
        observer.next(/* valor del observable */ 'agua')
        observer.next('agua')
        observer.next('mugre')
        observer.next('agua')
        observer.next('agua')
        // observer.error()
        // observer.complete()
    })

    miObservable.subscribe((agua) => console.log(agua))



    //=============== SUBJECT ===================
    //El subject es un observable que es observer a la vez

    const miSubject$ = new Subject<string>()

    // miSubject$.next('agua')
    // miSubject$.next('agua')
    // miSubject$.next('mugre')
    //Los eventos se colocan despues del subscribe

    miSubject$.subscribe((aguaSinFiltrar) => {
        console.log(`Subject: ${aguaSinFiltrar}`)
    })
    miSubject$.next('agua')
    miSubject$.next('agua')
    miSubject$.next('mugre')


    //========== Behavior subject ========
    // Es un tipo de observable especial que puede ser 
    // Observable y observer a la vez
    // Y ademas puede inicializarse con un valor

    const miBehaviourSubject$ = new BehaviorSubject<string>('dato')
    //Obligatoriamente debemos de inicializarlo

    miBehaviourSubject$.subscribe((dato) => {
        console.log(`Ya tengo el ${dato}`)
    })

    //========== OPERADORES ============

})()