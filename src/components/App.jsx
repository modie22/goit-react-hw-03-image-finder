import { Component } from 'react';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import { fetchImages } from './fetch/fetch';
import Searchbar from './Searchbar/Searchbar';
import Notiflix from 'notiflix';
import Loader from './Loader/Loader';


class App extends Component {
  state = {
    inputData: null,
    items: [],

    status: 'idle',
    totalHits: 0,
    page: 0,
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.inputData !== this.state.inputData) {
      this.createSearch();
    }
    else if (prevState.page !== this.state.page) {
      this.loadingNext();
    }
  }
  createSearch = async () => {
    try {
      this.setState({ status: 'pending' });
      const { totalHits, hits } = await fetchImages(
        this.state.inputData,
        this.state.page
      );
      if (hits.length < 1) {
        this.setState({ status: 'idle' });
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        this.setState({
          items: hits,
          totalHits: totalHits,
          status: 'resolved',
        });
      }
    } catch (error) {
      this.setState({ status: 'rejected' });
    }
  };
  handleSubmit = inputData => {
    console.log(inputData.trim());
    if ( inputData.trim() === '') {
      Notiflix.Notify.info('You cannot search by empty field, try again.');
      console.log(inputData)
      return;
    }
    this.setState({inputData: inputData.toLowerCase(), page: 1, items: [] }); 
  };
  loadingNext = async () => {
    this.setState({ status: 'pending' });

    try {
      const { hits } = await fetchImages(this.state.inputData, this.state.page);
      this.setState(prevState => ({
        items: [...prevState.items, ...hits],
        status: 'resolved',
      }));
    } catch (error) {
      this.setState({ status: 'rejected' });
    }
  };
  onNextPage = async () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };
  render() {
    const { totalHits, status, items } = this.state;
    if (status === 'idle') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.handleSubmit} />
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.handleSubmit} />
          <ImageGallery page={this.state.page} items={this.state.items} />
          <Loader />
          {totalHits > 12 && <Button onClick={this.onNextPage} />}
        </div>
      );
    }
    if (status === 'rejected') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.handleSubmit} />
          <p>Something wrong, try later</p>
        </div>
      );
    }
    if (status === 'resolved') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.handleSubmit} />
          <ImageGallery page={this.state.page} items={this.state.items} />
          {totalHits > 12 && totalHits > items.length && (
            <Button onClick={this.onNextPage} />
          )}
        </div>
      );
    }
  }
}
export default App;
