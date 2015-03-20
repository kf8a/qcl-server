var Result =  React.createClass({

  render: function() {
    if (this.props.recording){
    return(
      <div className='results'>
        <div className="row">
          <div className="col-md-8">
          <button type='button' className="btn btn-primary btn-block btn-large" onClick={this.props.handleSubmit}>Save</button>
          </div>
          <div className="col-md-4">
          <button className='btn btn-default btn-block btn-large' type='button' onClick={this.props.handleCancel}>Cancel</button>
          </div>
        </div>
        <ul className='flux list-unstyled'>
        <li>N2O: { numeral(this.props.n2o * 100000).format('+0.0')} </li>
        <li>CO2: { numeral(this.props.co2 * 100000).format('+0.0')} </li>
        <li>CH4: { numeral(this.props.ch4 * 100000).format('+0.0')} </li>
        </ul>
      </div>
    )
    } else {
      return(
      <div className='results'>
        <button type='button' className="btn btn-primary btn-lg btn-block" onClick={this.props.handleSubmit}>Record</button>
        </div>
      )
  }
  }
})
