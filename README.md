# ng-scales
![example workflow](https://github.com/mattfors/ng-scales/actions/workflows/main.yml/badge.svg)

Ng-scales is an Angular library for connecting to USB scales
## Get started
## Installing
Add the `npm` package to your app
```shell
npm i ng-scales
```

## Using in angular application
Add the providers in the `app.config.ts`
```typescript
providers: [
  ...
  provideNgScales()
  ...
]
```

The easiest way to integrate is the provided button directive which handles connecting and disconnecting from the scale. Add this into your template

```html
<button libNgScalesConnectionButton></button>
```

Import the component
```typescript
@Component({
  ...
  imports: [NgScalesConnectionButtonDirective]
  ...
})
```

### Built in support
| Vendor | Vendor ID | Product | Product Id |                 Name                  | Verified |
|:------:|:----------|:-------:|:-----------|:-------------------------------------:|:--------:|
|  DYMO  | 2338     |   M25   | 32771      |  DYMO M25 25 Lb Digital Postal Scale  |    ✅     |

### Adding support for additional scales
You can add a new scale by providing additional mappers. The mapper function coverts the array buffer 

```typescript
  provideNgScales({mappers: [
    {
      vendorId: 2338,
      productId: 32771,
      mapper: (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
        const d = new Uint8Array(arrayBuffer);
        let weight = (d[3] + 256 * d[4])/10;
        if (d[0] === 5) {
          weight *= -1;
        }
        return {
          units: d[1] === 2 ? 'grams' : 'ounces',
          weight
        };
      }
    }
  ]})
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
