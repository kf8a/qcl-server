var Result =  React.createClass({

  render: function() {
    return(
      <div className='results'>
        <ul>
        <li>N2O: { numeral(this.props.n2o * 100000).format('+0.0')} </li>
        <li>CO2: { numeral(this.props.co2 * 100000).format('+0.0')} </li>
        <li>CH4: { numeral(this.props.ch4 * 100000).format('+0.0')} </li>
        </ul>
      </div>
    )
  }
})
