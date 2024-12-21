const NoSearchResult = ({ title1, title2 }: any) => {
  return (
    <>
      <div className="noresult">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning display-5"></i>
          <h5 className="mt-2"> {title1 ?? "Sorry! No Result Found"}</h5>
          <p className="text-muted mb-0">
            {title2 ??
              "We have searched more than 150+ transactions We did not find any transactions for you search."}
          </p>
        </div>
      </div>
    </>
  );
};

export default NoSearchResult;
