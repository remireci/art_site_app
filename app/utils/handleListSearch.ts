const handleSearch = useCallBack(async () => {
    setInitialLoad(false)
    try {
        setLoading(true);
        console.log(query);
        const response = await fetch(`/api/search?terms=${query}`);
        const responseData = await response.json();

        // Assuming the backend response is an object with a 'data' property containing an array
        const data = responseData.data || [];

        // Assuming the backend response is an object with a 'urls' property            
        setResults(data);

        // Store articles in local storage to show them if needed dynamically

        const articles = data.filter(result => result.source === 'articles');

        localStorage.setItem('articles', JSON.stringify(articles));
        console.log("localStorage set");

    } catch (error) {
        console.error('Error searching:', error);
    } finally {
        setLoading(false);
    }
}, [query]);