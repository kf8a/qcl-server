var Result =  React.createClass({

  render: function() {
    return(
      <div className='results'>
        <ul>
        <li>N2O: { this.props.n2o} </li>
        <li>CO2: { this.props.co2} </li>
        <li>CH4: { this.props.ch4} </li>
        </ul>
      </div>
    )
  }
})
