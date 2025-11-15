export const lightThemeOverrides = {
  'common': {
    duration: '0.2s',
    borderRadius: '4px',
    primaryColor: '#ff9900',
    primaryColorHover: '#ffaa00',
    primaryColorPressed: '#e68900',
    baseColor: '#242424',
    textColor2: '#ffffff',
    textColor3: '#cccccc'
  },
  'InternalSelection': {
    textColor: '#ffffff',
    placeholderColor: '#cccccc',
    color: '#242424',
    colorActive: '#2d2d2d',
    border: '1px solid #333333',
    borderHover: '1px solid #ff9900',
    borderActive: '1px solid #ff9900',
    borderFocus: '1px solid #ff9900'
  },
  'Pagination': {
    itemTextColor: '#ffffff',
    itemColorHover: 'rgba(255, 153, 0, 0.2)',
    itemColorPressed: 'rgba(255, 153, 0, 0.3)',
    itemColorActive: 'rgba(255, 153, 0, 0.4)',
    itemBorderRadius: '4px'
  },
  'Tag': {
    borderRadius: '4px'
  },
  'Input': {
    borderHover: '#ff9900',
    borderFocus: '#ff9900',
    color: '#242424',
    textColor: '#ffffff',
    placeholderColor: '#cccccc'
  },
  'Card': {
    borderRadius: '4px',
    color: '#242424',
    colorModal: '#242424'
  },
  'Select': {
    peers: {
      InternalSelection: {
        textColor: '#ffffff',
        placeholderColor: '#cccccc',
        color: '#242424',
        colorActive: '#2d2d2d',
        border: '1px solid #333333',
        borderHover: '1px solid #ff9900',
        borderActive: '1px solid #ff9900',
        borderFocus: '1px solid #ff9900'
      },
      InternalSelectMenu: {
        color: '#242424',
        optionTextColor: '#ffffff',
        optionColorHover: 'rgba(255, 153, 0, 0.2)',
        optionColorActive: 'rgba(255, 153, 0, 0.3)',
        optionTextColorActive: '#000000'
      }
    }
  },
  'Button': {
    borderRadius: '4px',
    paddingMedium: '0 18px',
    heightMedium: '34px',
    textColorPrimary: '#000000',
    textColorHoverPrimary: '#000000',
    textColorQuaternary: '#ffffff',
    textColorQuaternaryHover: '#ffffff',
    textColorQuaternaryPressed: '#ffffff',
    colorQuaternary: 'transparent',
    colorQuaternaryHover: 'rgba(255, 153, 0, 0.1)',
    colorQuaternaryPressed: 'rgba(255, 153, 0, 0.2)',
    borderQuaternary: '1px solid #ff9900',
    borderQuaternaryHover: '1px solid #ffaa00',
    borderQuaternaryPressed: '1px solid #e68900'
  }
}
