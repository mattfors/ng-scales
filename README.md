# ng-scales
[![npm version](https://badge.fury.io/js/ng-scales.svg)](https://badge.fury.io/js/ng-scales)
![workflow](https://github.com/mattfors/ng-scales/actions/workflows/main.yml/badge.svg)
![Coverage](https://mattfors.github.io/ng-scales/coverage-badges.svg)
![code ql](https://github.com/mattfors/ng-scales/actions/workflows/codeql.yml/badge.svg)
![Known Vulnerabilities](https://snyk.io/test/github/mattfors/ng-scales/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


Angular library for connecting to USB scales

## Demo
Check out the [live demo](https://mattfors.github.io/ng-scales/)


## Get started
### Installing
Add the `npm` package to your app
```shell
npm i ng-scales
```

### Using in angular application
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

## Hardware Support

### Built in support
| Vendor | Vendor ID | Product | Product Id |                 Name                  | Verified |
|:------:|:----------|:-------:|:-----------|:-------------------------------------:|:--------:|
|  DYMO  | 2338     |   M25   | 32771      |  DYMO M25 25 Lb Digital Postal Scale  |    ✅     |

### Adding support for additional scales
You can add a new scale by providing additional mappers. The mapper function coverts the array buffer into a usable data object

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
