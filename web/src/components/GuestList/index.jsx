import React, { Component } from 'react';

import * as api from 'lib/api';

export default class GuestList extends Component {
  constructor (props) {
    super(props);

    this.state = { groups: props.groups };
  }

  createGroup () {
    api.create_group({}, (data) => {
      const { groups } = this.state;
      groups.push(data);
      this.setState({ groups });
    });
  }

  deleteGroup (id) {
    const groups = this.state.groups.filter((group) => {
      return group.id !== id;
    });

    this.setState({ groups });
    api.delete_group(id);
  }

  render () {
    const { groups } = this.state;

    return (
      <div>
        <ul>
          {groups.map((group) =>
            <li key={group.id}>
              <GuestParty
                id={group.id}
                guests={group.guests}
                onDelete={() => this.deleteGroup(group.id)}
              />
            </li>
          )}

          <li>
            <a onClick={() => this.createGroup()}>
              Add Guest Party
            </a>
          </li>
        </ul>
      </div>
    );
  }
}


class GuestParty extends Component {
  constructor (props) {
    super(props);
    this.state = {
      guests: props.guests,
      next_guest: '',
    };
  }

  addGuest () {
    const { id } = this.props;
    const { next_guest } = this.state;

    if (!next_guest.match(/[^ ]/)) {
      return;
    }

    api.create_guest(id, next_guest, (data) => {
      let { guests } = this.state;
      guests.push(data);
      this.setState({ guests, next_guest: '' });
    });
  }

  deleteGuest (id) {
    api.delete_guest(id);

    const guests = this.state.guests.filter((guest) => {
      return guest.id !== id;
    });
    this.setState({ guests });
  }

  render () {
    const { id, onDelete } = this.props;
    const { guests } = this.state;

    return (
      <div>
        <ul>
          {guests.map((guest) =>
            <li key={guest.id}>
              <Guest
                guest={guest}
                onDelete={() => this.deleteGuest(guest.id)}
              />
            </li>
          )}

          <li>
            <form action='javascript:;' onSubmit={() => this.addGuest()}>
              <input
                type='text'
                onChange={(e) => this.setState({
                  next_guest: e.target.value,
                })}
                value={this.state.next_guest}
              />

              <a onClick={() => this.addGuest()}>
                Save
              </a>
            </form>
          </li>
        </ul>

        <a onClick={onDelete}>
          Delete Group
        </a>
      </div>
    );
  }
}


class Guest extends Component {
  constructor (props) {
    super(props);

    this.state = {
      next_tag: '',
      tags: props.guest.tags,
    }
  }

  addTag () {
    const { next_tag, tags } = this.state;
    const guest_id = this.props.guest.id;

    api.add_tag(guest_id, next_tag, (data) => {
      this.setState({ tags: data.tags, next_tag: '' });
    });
  }

  deleteTag (tag_id) {
    const guest_id = this.props.guest.id;
    api.remove_tag(guest_id, tag_id);

    const tags = this.state.tags.filter((tag) => {
      return tag.id !== tag_id;
    });
    this.setState({ tags });
  }

  render () {
    const { guest, onDelete } = this.props;
    const { next_tag, tags } = this.state;

    return (
      <div>
        {guest.name}

        <ul>
          {tags.map((tag) =>
            <li key={tag.id}>
              {tag.text}

              <a onClick={() => this.deleteTag(tag.id)}>
                Delete Tag
              </a>
            </li>
          )}

          <li>
            <form action='javascript:;' onSubmit={() => this.addTag()}>
              <input
                type='text'
                value={this.state.next_tag}
                onChange={(e) => this.setState({
                  next_tag: e.target.value,
                })}
              />

              <a onClick={() => this.addTag()}>
                Save
              </a>
            </form>
          </li>
        </ul>

        <a onClick={onDelete}>
          Delete Guest
        </a>
      </div>
    );
  }
}
