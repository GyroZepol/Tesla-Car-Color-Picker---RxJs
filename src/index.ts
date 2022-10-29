import { delay, map, tap, zipAll, of, distinctUntilChanged, take, fromEvent, filter } from 'rxjs';
import "./styles/main.scss"
import { carFrom$, state$ } from './utils/mockData'

(function () {

    /**
     * Elementos HTML
     */

    const modelTitle: HTMLElement = document.querySelector('.model-title')
    const modelSubTitle: HTMLElement = document.querySelector('.model-subtitle')
    const loadingLayer: HTMLElement = document.querySelector('.loading')
    const modelHighLight: HTMLElement = document.querySelector('.model-highlight')
    const modelColors: HTMLElement = document.querySelector('.model-colors')
    const carImage: HTMLElement = document.querySelector('.car-image')
    const listFeatures: HTMLElement = document.querySelector('.list-features')

    
    const source$ = carFrom$.pipe(
        delay(1500),
        tap(() => {
            loadingLayer.style.display = 'none'
        })
    )


    const title$ = source$.pipe(map(all => all.name))

    const subTitle$ = source$.pipe(
        map(all => all.description),
        tap((todo) => console.log(todo))
    )

    const highlight$ = source$.pipe(
        tap((before) => console.log(before)),
        map((all) => {
            const mapHighLight = all.highlight.map((item: any) => {
                return `<div class="text-center">
                            <div>
                                <h2>${item.amount}<small>${item.symbol}</small></h2>
                            </div>
                            <div>
                                <small class="text-muted d-flex d-flex-wrap box-feature">
                                ${item.short}
                                </small>
                            </div>
                        </div>`
            })
            return mapHighLight
        }),
        tap((after) => console.log(after))
    )

    const colors$ = source$.pipe(
        tap((before) => console.log(before)),
        map((allRow) => {
            const mapHighLight = allRow.colors.map((item: any) => {
                const isColor = (state$.getValue().color === item.name) ? 'active' : ''
                return `<span class="click-color ${item.name} ${isColor}"></span>`
            })
            return mapHighLight
        }),
        tap((after) => console.log(after))
    )

    const colorsClick$ = fromEvent(modelColors,'click').pipe(
        map((colorEvent: MouseEvent) => colorEvent.target),
        filter((colorTarget: HTMLElement) => colorTarget.classList.contains('click-color')),
        tap(() => {
            modelColors.childNodes.forEach((colorChild: HTMLElement) => {
                const [,color] = colorChild.classList.toString().split(' ')
                carImage.classList.remove(color)
                colorChild.classList.remove('active')
            })
        }),
        map((colorTarget: HTMLElement) => {
            colorTarget.classList.add('active')
            const [,color] = colorTarget.classList.toString().split(' ')
            return color
        })
    )

    const features$ = source$.pipe(
        tap((before) => console.log(before)),
        map((allRow) => {
            const mapFeature = allRow.features.map((feature: string) => {
                return `<li>${feature}</li>`
            })
            return mapFeature
        }),
        tap((after) => console.log(after))
    )



    title$.subscribe(title => modelTitle.innerHTML = title)
    subTitle$.subscribe(subTitle => modelSubTitle.innerHTML = subTitle)
    highlight$.subscribe((highlight) => modelHighLight.innerHTML = highlight.join(''))
    colors$.subscribe((color) => modelColors.innerHTML = color.join(''))
    features$.subscribe((feature) => listFeatures.innerHTML = feature.join(''))


    colorsClick$.subscribe((color: string) => {
       state$.next({color})
    }) 

    /**
     *  State de la APP
     */

    state$.subscribe(({color}) => {
     carImage.classList.add(color)
    })

    // const colors$ = carFrom$.pipe(
    //     map((todoElObjeto) => todoElObjeto.colors)
    // )
    // const car = colors$.subscribe((color) => {
    //     console.log({ color })
    // })






    // of(1,2,3,3,3,4,5,6,7)
    // // .pipe(distinctUntilChanged())//Eliminar datos repetidos
    // .pipe(take(2)) //Cuantos valores quieres tomar
    // .subscribe(capturarNumerosUnicos =>{
    //     console.log(capturarNumerosUnicos)
    // })





















})()