/**
 * default state
 * mouse - enter
 * clicked state
 * mouse - out
 * selected state
 * disabled
 */
export enum events {
  normal = 'normal',
  hover = 'hover',
  down = 'down',
  disable = 'disable',
  active = 'active',
}

export enum dndEvents {
  normal = 'normal',
  hover = 'hover',
  down = 'down',
  disable = 'disable',
}

export enum checkBoxEvents {
  normal = 'normal',
  hover = 'hover',
  down = 'down',
  disable = 'disable',
  active = 'active',
  out = 'out',
}

export enum dropdownEvents {
  normal = 'normal',
  hover = 'hover',
  down = 'down',
  disable = 'disable',
  hoverOption = 'hoverOption',
}

export enum radioEvents {
  normal = 'normal',
  hover = 'hover',
  down = 'down',
  up = 'up',
  disable = 'disable',
}

export enum sliderEvents {
  normal = 'normal',
  hover = 'hover',
  down = 'down',
  disable = 'disable',
  pressmove = 'pressmove',
  pressup = 'pressup',
}

export enum toggleEvents {
  normal = 'normal',
  hover = 'hover',
  disable = 'disable',
}

export enum mouseEvents {
  down = 'mousedown',
  up = 'pressup',
  move = 'pressmove',
  click = 'click',
  over = 'mouseover',
  out = 'mouseout',
}

export enum domEvents {
  down = 'mousedown touchstart',
  up = 'mouseup touchend',
  move = 'mousemove touchmove',
  click = 'click',
  over = 'mouseover',
  out = 'mouseout',
  keydown = 'keydown',
}
