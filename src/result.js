var Result =  React.createClass({

  render: function() {
    if (this.props.recording){
    return(
      <div className='results'>
        <div className="row">
        <div className="col-md-6">
          <ul className='flux list-unstyled'>
          <li>N2O: { numeral(this.props.n2o).format('+0.00000000')} </li>
          <li>CO2: { numeral(this.props.co2).format('+0.00000000')} </li>
          <li>CH4: { numeral(this.props.ch4).format('+0.00000000')} </li>
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
        <form className='form'>
        <div className="form-group">
        <label for="location">Location</label>
          <select id="location">
            <option value='T1R1'>T1R1</option>
            <option value="T1R2">T1R2</option>
          </select>
          </div>
          <div className="form-group">
          <label for="height">Height</label>
          <input id="height" type='number'/> cm
        </div>
        </form>
        <button type='button' className="btn btn-primary btn-lg" onClick={this.props.handleRecord}>Record</button>
        </div>
      )
  }
  }
})
