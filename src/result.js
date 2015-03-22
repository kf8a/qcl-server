var Result =  React.createClass({

  render: function() {
    if (this.props.recording){
    return(
      <div className='results'>
        <div className="row">
        <div className="col-md-6">
          <ul className='flux list-unstyled'>
          <li>N2O: { numeral(this.props.n2o * 100000).format('+0.0')} </li>
          <li>CO2: { numeral(this.props.co2 * 100000).format('+0.0')} </li>
          <li>CH4: { numeral(this.props.ch4 * 100000).format('+0.0')} </li>
          </ul>
        </div>
          <div className="col-md-3">
          <button type='button' className="btn btn-primary btn-block btn-lg" onClick={this.props.handleSave}>Save</button>
          </div>
          <div className="col-md-3">
          <button className='btn btn-default btn-block btn-lg' type='button' onClick={this.props.handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
    } else {
      return(
      <div className='results'>
        <button type='button' className="btn btn-primary btn-lg btn-block" onClick={this.props.handleRecord}>Record</button>
        </div>
      )
  }
  }
})
