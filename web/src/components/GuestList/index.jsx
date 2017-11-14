import React, { Component } from 'react';

export default class GuestList extends Component {
  createGroup () {
    console.log('nah')
  }

  render () {
    const { groups } = this.props;

    return (
      <div className='guest-list'>
        {groups.map((group) =>
          <GuestParty
            id={group.id}
            guests={group.guests}
          />
        )}

        <a onClick={this.createGroup()}>
          Add Guest Party
        </a>
      </div>
    );
  }
}


class GuestParty extends Component {
  constructor () {
    this.state = { next_guest: '' };
  }

  addGuest () {
    console.log(this.state.next_guest)
  }

  render () {
    const { guests, id } = this.props;

    return (
      <div className='guest-party'>
        {guests.map((guest) =>
          <div className='guest'>
            {guest.name}
          </div>
        )}

        <div className='new-guest'>
          <form onSubmit={() => this.addGuest()}>
            <input
              type='text'
              onChange={(val) => this.setState({ next_guest: val })}
              value={this.state.next_guest}
            />

            <a
              className='form-submit'
              onClick={() => this.addGuest()}
            >
              Save
            </a>
          </form>
        </div>
      </div>
    );
  }
}
