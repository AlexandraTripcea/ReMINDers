import {animate, state, style, transition, trigger} from '@angular/animations';

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

export const sliderNpopper = trigger('sliderNpopper', [
  state('slider', style({
    transform: 'translateX(0%)', opacity: '1'
  })),
  state('pop', style({
    transform: 'translateX(0%)', opacity: '1'
  })),
  transition('void => slider', [
    style({transform: 'translateX(-400%)', opacity: '0'}),
    animate('600ms ease-in')
  ]),
  transition('slider => void', [
    animate('600ms ease-out', style({transform: 'translateX(400%)', opacity: '0'}))
  ]),
  transition('void => pop', [
    style({transform: 'translateX(-400%)', opacity: '0'}),
    animate('600ms ease-in')
  ]),
  transition('popper => pop', [
    animate('600ms ease-out', style({transform: 'translateY(400%)', opacity: '0'}))
  ]),

]);

export const sliderNext = trigger('sliderNext', [
  transition(':enter', [
    style({transform: 'translateX(-400%)', opacity: '0'}),
    animate('600ms ease-out', style({transform: 'translateX(0%)', opacity: '1'}))
  ]),
  transition(':leave', [
    animate('600ms ease-in', style({transform: 'translateX(+400%)', opacity: '0'}))
  ])
]);

export const sliderPrev = trigger('sliderPrev', [
  transition(':enter', [
    style({transform: 'translateX(500%)', opacity: '0'}),
    animate('600ms ease-out', style({transform: 'translateX(0%)', opacity: '1'}))
  ]),
  transition(':leave', [
    animate('600ms ease-in', style({transform: 'translateX(-400%)', opacity: '0'}))
  ])
]);

export const slider = trigger('slider', [
  state('next', style({
    transform: 'translateX(0%)', opacity: '1'
  })),
  state('prev', style({
    transform: 'translateX(0%)', opacity: '1'
  })),
  transition('void => next', [
    style({transform: 'translateX(-400%)', opacity: '0'}),
    animate('600ms ease-in')
  ]),
  transition('next => void', [
    animate('600ms ease-out', style({transform: 'translateX(400%)', opacity: '0'}))
  ]),
  transition('void => prev', [
    style({transform: 'translateX(400%)', opacity: '0'}),
    animate('600ms ease-in')
  ]),
  transition('prev => void', [
    animate('600ms ease-out', style({transform: 'translateX(-400%)', opacity: '0'}))
  ])
]);

