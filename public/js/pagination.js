const paginate = document.getElementById('paginate');
const $campgroundsContainer = $('#campgrounds-container');
paginate.addEventListener('click', function (e) {
    e.preventDefault();
    fetch(this.href)
        .then(response => response.json())
        .then(data => {
            for (const campground of data.docs) {
                let template = generateCampground(campground);
                $campgroundsContainer.append(template);
            }
            let { nextPage } = data;
            this.href = this.href.replace(/page=\d+/, `page=${nextPage}`)
        })
        .catch(err => console.log(err))
})
function generateCampground(campground) {
    let template = `<div class="card mb-3">
    <div class="row">
        <div class="col-md-4">
                <img class="img-fluid" alt="" src="${campground.image.length ? campground.image[0].url : 'https://res.cloudinary.com/danazvoz1/image/upload/v1631455639/YelpCamp/hpl3umvucnfn9yilqtwj.jpg'}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${campground.title}
                        </h5>
                        <p class="card-text">
                            ${campground.description}
                        </p>
                        <p class="card-text">
                            <small class="text-muted">
                                ${campground.location}
                            </small>
                        </p>
                        <a class="btn btn-primary" href="/campgrounds/${campground._id} ">View ${campground.title} </a>
                    </div>
                </div>
            </div>
        </div>`;
    return template
}
