class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.paginationResult = {}; // Initialize paginationResult
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    filter() {
        const queryObj = { ...this.queryString }; // Clone query string
        const excludedFields = ['sort', 'limit', 'fields', 'page', 'keyword']; // Exclude these fields
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj); // Convert to JSON string
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // Add $ to operators

        // Parse and apply the filter
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this; // Allow chaining
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); // Default sort
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v"); // Exclude version
        }
        return this;
    }

    paginate(countDocuments) {
        const page = Number(this.queryString.page) || 1; // Ensure page is a number
        const limit = Number(this.queryString.limit) || 10; // Ensure limit is a number
        const skip = (page - 1) * limit;

        // Pagination result
        this.paginationResult.currentPage = page;
        this.paginationResult.limit = limit;
        this.paginationResult.numberOfPages = Math.ceil(countDocuments / limit);

        // next page
        if (skip + limit < countDocuments) {
            this.paginationResult.next = page + 1;
        }
        if (page > 1) {
            this.paginationResult.prev = page - 1;
        }

        // Apply pagination to the mongoose query
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this; // Allow chaining
    }
}

module.exports = ApiFeatures;
