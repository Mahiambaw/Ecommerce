class apiFeatures{

  constructor(query,reqQuery){
    this.query = query;
    this.reqQuery= reqQuery;
  }

   filter(){
     let queryObj = {...this.reqQuery}; 
     console.log(queryObj);
     const queryExclude= ['limit','page','sort', "field"];
     queryExclude.forEach(el=> delete queryObj[el]);
       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
       console.log(queryStr, "api")
       this.query= this.query.find(JSON.parse(queryStr))
       return this;
        
   }
   sort(){
     if(this.reqQuery.sort){
       const sortBy = this.reqQuery.sort.split(',').join(" ");
       this.query = this.query.sort(sortBy);
     }
     else{
       this.query= this.query.sort('createdAt');
     }
    return this;
   }
   litmtedFields(){
     if(this.reqQuery.fields){
       const fields = this.reqQuery.fields.split(',').join(" ");
       this.query= this.query.select(fields);
       return this;
     }else{
       this.query= this.query.select('-_v')
     }
     return this;
   }
   paginate(){
     const page = this.reqQuery.page*1||1;
     const limit = this.reqQuery.limit*1||100;
     const skip= (page-1)*limit;
     this.query= this.query.skip(skip).limit(limit)
     return this;
   }
}
module.exports = apiFeatures;