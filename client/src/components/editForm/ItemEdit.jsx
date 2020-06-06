import React from "react";
import { withRouter } from "react-router";

class ItemEdit extends React.Component {
  constructor(props) {
    const collection = `${props.location.state.type}s`;
    super(props);
    this.state = {
      item: props.location.state.id
        ? {
            ...props.board[collection][props.location.state.id],
            type: props.location.state.type,
          }
        : props.location.state,
    };
    this.state.item.boardId = props.activeBoard;
  }
  handleTitleChange = (event) => {
    const updatedItem = {
      ...this.state.item,
      ...{ title: event.target.value },
    };
    this.setState({ item: updatedItem });
  };
  handleDescriptionChange = (event) => {
    const updatedItem = {
      ...this.state.item,
      ...{ description: event.target.value },
    };
    this.setState({ item: updatedItem });
  };

  upsertItem = (event) => {
    this.props.upsertSelectedItem({ ...this.state.item });
    this.props.history.push("/");
    this.setState({ item: {} });
  };

  deleteItem = (event) => {
    this.props.deleteItem(this.state.item);
    this.props.history.push("/");
    this.setState({ item: {} });
  };

  handleClose = (event) => {
    this.props.history.push("/");
  };
  render() {
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "110%",
          backgroundColor: "#000000d1",
          zIndex: "6",
        }}
      >
        <div
          className="ui container middle aligned aligned grid"
          style={{ zIndex: "7", position: "relative", left: "0%", top: "25%" }}
        >
          <div className="column" style={{ maxWidth: "40%", margin: "0 auto" }}>
            <h2
              className="ui teal image header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="content">
                {" "}
                {this.state.item.id
                  ? "Update " + this.state.item.type
                  : "Create " + this.state.item.type}
              </div>
              <i className="close icon" onClick={this.handleClose}></i>
            </h2>
            <form className="ui large form">
              <div className="ui stacked segment">
                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={this.state.item.title ? this.state.item.title : ""}
                    placeholder={`Write ${this.state.itemType}'s title here`}
                    onChange={this.handleTitleChange}
                  />
                </div>

                <div className="field">
                  <label>Description</label>
                  <textarea
                    rows="2"
                    type="text"
                    name="description"
                    value={
                      this.state.item.description
                        ? this.state.item.description
                        : ""
                    }
                    placeholder={`Write ${this.state.itemType}'s description here`}
                    onChange={this.handleDescriptionChange}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  {this.state.item.id && (
                    <div
                      className="ui fluid large red submit button basic"
                      onClick={this.deleteItem}
                    >
                      <div>Delete</div>
                    </div>
                  )}
                  <div
                    className="ui fluid large teal submit button"
                    onClick={this.upsertItem}
                  >
                    {this.state.item.id ? "Save" : "Create"}
                  </div>
                </div>
              </div>

              <div className="ui error message"></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ItemEdit);
