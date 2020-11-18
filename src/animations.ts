import {animate, style, transition, trigger} from '@angular/animations';

export const fader = trigger(
  'fader',
  [
    transition(
      ':enter',
      [
        style({opacity: 0}),
        animate('1s ease-out',
          style({opacity: 1}))
      ]
    ),
    transition(
      ':leave',
      [
        style({opacity: 1}),
        animate('1s ease-in',
          style({opacity: 0}))
      ]
    )
  ]
);

export const slider = trigger('slider', [
  transition(':enter', [
    style({transform: 'translateX(-400%)', opacity: '0'}),
    animate('600ms ease-out', style({transform: 'translateX(0%)', opacity: '1'}))
  ]),
  transition(':leave', [
    animate('600ms ease-in', style({transform: 'translateX(+400%)', opacity: '0'}))
  ])
]);

