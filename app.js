const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// 后端要改的地方:
// 1. playing_movied和playing_tvroppath换成poster, 返回数量变为6个 // 
// 2. movies_video -> movie_video //
// 3. recommend_tv -> recommend_tvs //
// 4. cast: if length() >= 6; return; // 
// 5. multi_search 7 -> 20 // 
// 6. multi_search rating + year // 

app.use(cors());

// /multi_search?que=
app.get('/multi_search', function(req, res) {
	var que = req.query.que;
	var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/search/multi?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&query=';
	url += que;
	https.get(url, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			// console.log(JSON.parse(data));
			let results = JSON.parse(data);
			lists = results.results;
			var back = [];
			let count = 0;
			for (var i = 0; i < lists.length; i++) {
				var curr = {};
				if (count >= 20) {
					break;
				} else {
					count++;
				}
				if (lists[i].backdrop_path === "" || lists[i].backdrop_path == null) {
					continue;
				}
				if (lists[i].media_type === "tv" || lists[i].media_type === "movie") {
					curr.id = lists[i].id;
					curr.name = lists[i].media_type === "tv" ? lists[i].name : lists[i].title;
					curr.release_date = lists[i].media_type === "tv" ? lists[i].first_air_date : lists[i].release_date;
					if (lists[i].backdrop_path === null) {
						curr.backdrop_path = "https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW6/imgs/movie-placeholder.jpg"
					} else {
						curr.backdrop_path = "https://image.tmdb.org/t/p/w500" + lists[i].backdrop_path;
					}
					curr.vote_average = lists[i].vote_average;
					curr.media_type = lists[i].media_type;
					back.push(curr);
				}
			}
			res.end(JSON.stringify(back));
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
});

// /trending_movies
app.get('/trending_movies', (req, res) => {
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/trending/movie/day?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].title;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'movie';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /top_rated_movies
app.get('/top_rated_movies', (req, res) => {
  	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/movie/top_rated?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].title;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'movie';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /playing_movies
app.get('/playing_movies', (req, res) => {
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			// console.log(JSON.parse(data));
			let results = JSON.parse(data);
			lists = results.results;
			console.log(lists);
			var back = [];
			let count = 0;
			for (var i = 0; i < lists.length; i++) {
				if(count == 6) {
					break;
				} else {
					count++;
				}
				var curr = {};
				curr.id = lists[i].id;
				curr.title = lists[i].title;
				curr.poster_path = "https://image.tmdb.org/t/p/original" + lists[i].poster_path;
				curr.category = 'movie';
				back.push(curr);
			}
			res.end(JSON.stringify(back));
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
})

// /popular_movies
app.get('/popular_movies', (req, res) => {
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/movie/popular?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].title;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'movie';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /recommend_movies?que=<movie_id>
app.get('/recommend_movies', (req, res) => {
	var que = req.query.que;
	var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/movie/' + que + '/recommendations?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].title;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'movie';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /similar_movies?que=<movie_id>
app.get('/similar_movies', (req, res) => {
	var que = req.query.que;
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/movie/" + que + "/similar?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].title;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'movie';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /movies_video?que=<movie_id>
app.get('/movies_video', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/movie/' + que + '/videos?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.site = lists[i].site;
    		curr.type = lists[i].type;
    		curr.name = lists[i].name;
    		curr.key = 'https://www.youtube.com/watch?v=' + lists[i].key;
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /movie_details?que=<movie_id>
app.get('/movie_details', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/movie/' + que + '?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let lists = JSON.parse(data);
	    console.log(lists);
    	var curr = {};
    	curr.id = lists.id;
		curr.title = lists.title;
		curr.genres = lists.genres;
		curr.spoken_languages = lists.spoken_languages;
		curr.release_date = lists.release_date;
		curr.runtime = lists.runtime;
		curr.overview = lists.overview;
		curr.vote_average = lists.vote_average;
		curr.tagline = lists.tagline;
		if (lists.poster_path === null) {
			curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
		} else {
			curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists.poster_path;
		}
		if (lists.backdrop_path === null) {
			curr.backdrop_path = "https://cinemaone.net/images/movie_placeholder.png";
		} else {
			curr.backdrop_path = "https://image.tmdb.org/t/p/w500" + lists.backdrop_path;
		}
		curr.category = 'movie';
	    res.end(JSON.stringify(curr));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /movie_reviews?que=<movie_id>
app.get('/movie_reviews', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/movie/' + que + '/reviews?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	if (i === 3) {
    			break;
			}
	    	var curr = {};
    		curr.author = lists[i].author;
    		curr.content = lists[i].content;
    		curr.created_at = lists[i].created_at;
    		curr.url = lists[i].url;
    		curr.rating = lists[i].author_details.rating == null ? 0 : lists[i].author_details.rating;
    		if (lists[i].author_details.avatar_path == null) {
				curr.avatar_path = "https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW8/ReviewsPlaceholderImage.jpg";
			} else if(lists[i].author_details.avatar_path.substr(0,6) === "/https"){
				curr.avatar_path = lists[i].author_details.avatar_path.substr(1);
			} else {
				curr.avatar_path = 'https://image.tmdb.org/t/p/original' + lists[i].author_details.avatar_path;
			}
    		// curr.avatar_path = lists[i].author_details.avatar_path == null ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU' : 'https://image.tmdb.org/t/p/original' + lists[i].author_details.avatar_path;
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /movie_cast?que=<movie_id>
app.get('/movie_cast', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/movie/' + que + '/credits?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let results = JSON.parse(data);
	    lists = results.cast;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	if (i === 6) {
    			break;
			}
			if (lists[i].profile_path != null) {
				var curr = {};
				curr.id = lists[i].id;
				curr.name = lists[i].name;
				curr.character = lists[i].character;
				curr.profile_path = 'https://image.tmdb.org/t/p/w500' + lists[i].profile_path;
				back.push(curr);
			}
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// ------------------  TV --------------------

// /trending_tv
app.get('/trending_tv', (req, res) => {
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/trending/tv/day?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].name;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'tv';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /top_rated_tv
app.get('/top_rated_tv', (req, res) => {
  	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/tv/top_rated?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].name;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'tv';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /popular_tv
app.get('/popular_tv', (req, res) => {
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/tv/popular?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    // console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].name;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'tv';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /recommend_tv?que=<tv_id>
app.get('/recommend_tv', (req, res) => {
	var que = req.query.que;
	var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/tv/' + que + '/recommendations?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    // console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].name;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'tv';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /similar_tv?que=<tv_id>
app.get('/similar_tv', (req, res) => {
	var que = req.query.que;
	var lists;
	const https = require('https');
	let url = "https://api.themoviedb.org/3/tv/" + que + "/similar?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1";
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    // console.log(JSON.parse(data));
	    let results = JSON.parse(data);
	    lists = results.results;
	    // console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.id = lists[i].id;
    		curr.title = lists[i].name;
			if (lists[i].poster_path === null) {
				curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
			} else {
				curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists[i].poster_path;
			}
			curr.category = 'tv';
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
})

// /tv_video?que=<tv_id>
app.get('/tv_video', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/tv/' + que + '/videos?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let results = JSON.parse(data);
	    lists = results.results;
	    // console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	var curr = {};
    		curr.site = lists[i].site;
    		curr.type = lists[i].type;
    		curr.name = lists[i].name;
    		curr.key = 'https://www.youtube.com/watch?v=' + lists[i].key;
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /tv_details?que=<tv_id>
app.get('/tv_details', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/tv/' + que + '?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let lists = JSON.parse(data);
	    // console.log(lists);
    	var curr = {};
    	curr.id = lists.id;
		curr.title = lists.name;
		curr.genres = lists.genres;
		curr.spoken_languages = lists.spoken_languages;
		curr.release_date = lists.first_air_date;
		curr.runtime = lists.episode_run_time;
		curr.overview = lists.overview;
		curr.vote_average = lists.vote_average;
		curr.tagline = lists.tagline;
		if (lists.poster_path === null) {
			curr.poster_path = "https://cinemaone.net/images/movie_placeholder.png";
		} else {
			curr.poster_path = "https://image.tmdb.org/t/p/w500" + lists.poster_path;
		}
		if (lists.backdrop_path === null) {
			curr.backdrop_path = "https://cinemaone.net/images/movie_placeholder.png";
		} else {
			curr.backdrop_path = "https://image.tmdb.org/t/p/w500" + lists.backdrop_path;
		}
		curr.category = 'tv';
	    res.end(JSON.stringify(curr));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /tv_reviews?que=<tv_id>
app.get('/tv_reviews', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/tv/' + que + '/reviews?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let results = JSON.parse(data);
	    lists = results.results;
	    // console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	if (i === 3) {
				break;
			}
	    	var curr = {};
    		curr.author = lists[i].author;
    		curr.content = lists[i].content;
    		curr.created_at = lists[i].created_at;
    		curr.url = lists[i].url;
    		curr.rating = lists[i].author_details.rating == null ? 0 : lists[i].author_details.rating;
			if (lists[i].author_details.avatar_path == null) {
				curr.avatar_path = "https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW8/ReviewsPlaceholderImage.jpg";
			} else if(lists[i].author_details.avatar_path.substr(0,6) =="/https"){
				curr.avatar_path = lists[i].author_details.avatar_path.substr(1);
			} else {
				curr.avatar_path = 'https://image.tmdb.org/t/p/original' + lists[i].author_details.avatar_path;
			}
    		back.push(curr);
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /tv_cast?que=<tv_id>
app.get('/tv_cast', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/tv/' + que + '/credits?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let results = JSON.parse(data);
	    lists = results.cast;
	    // console.log(lists);
	    var back = [];
	    for (var i = 0; i < lists.length; i++) {
	    	if (i === 6) {
    			break;
			}
	    	if (lists[i].profile_path != null) {
	    		var curr = {};
	    		curr.id = lists[i].id;
	    		curr.name = lists[i].name;
	    		curr.character = lists[i].character;
	    		curr.profile_path = 'https://image.tmdb.org/t/p/w500' + lists[i].profile_path;
	    		back.push(curr);
	    	}
	    }
	    res.end(JSON.stringify(back));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// ------------------  Cast Information --------------------

// /cast_details?que=<person_id>
app.get('/cast_details', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/person/' + que + '?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let lists = JSON.parse(data);
	    // console.log(lists);
    	var curr = {};
		curr.birthday = lists.birthday;
		curr.birthplace = lists.place_of_birth;
		curr.gender = lists.gender;
		curr.name = lists.name;
		curr.imgpath = 'https://image.tmdb.org/t/p/w500' + lists.profile_path;
		curr.homepage = lists.homepage;
		curr.also_known_as = lists.also_known_as;
		curr.known_for_department = lists.known_for_department;
		curr.biography = lists.biography;
	    res.end(JSON.stringify(curr));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

// /cast_external_ids?que=<person_id>
app.get('/cast_external_ids', function(req, res) {
    var que = req.query.que;
    var lists;
	const https = require('https');
	let url = 'https://api.themoviedb.org/3/person/' + que + '/external_ids?api_key=d0b8a4b7be9d65bbe1c21afa82d359ce&language=en-US&page=1';
	https.get(url, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	    let lists = JSON.parse(data);
	    // console.log(lists);
    	var curr = {};
		curr.imdb_id = (lists.imdb_id == null || lists.imdb_id === '') ? '' : 'https://www.imdb.com/name/' + lists.imdb_id;
		curr.facebook_id = (lists.facebook_id == null || lists.facebook_id === '') ? '' : 'https://www.facebook.com/' + lists.facebook_id;
		curr.instagram_id = (lists.instagram_id == null || lists.instagram_id === '') ? '' : 'https://www.instagram.com/' + lists.instagram_id;
		curr.twitter_id = (lists.twitter_id == null || lists.twitter_id === '') ? '' : 'https://www.twitter.com/' + lists.twitter_id;
	    res.end(JSON.stringify(curr));
	  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
