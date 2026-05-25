proc import file="blossom_correctness_time.csv"
    DBMS=CSV
	OUT=BLOSSOM.CORRECTNESS;
	GETNAMES=YES;
run;

/* Optional: check variable names and levels */
proc contents data=BLOSSOM.CORRECTNESS; run;
proc freq data=BLOSSOM.CORRECTNESS;
    tables vis task_order correctness / missing;
run;

/* GLMM for binary correctness */
proc glimmix data=BLOSSOM.CORRECTNESS method=laplace;
    class participant_id
          vis (ref="blossom")
          task_order (ref="1");

    model correctness(event='1') =
          vis
          task_order
          vis*task_order
          / dist=binary link=logit solution ddfm=residual;

    random intercept / subject=participant_id;

    lsmeans vis / ilink diff adjust=tukey cl;
    lsmeans task_order / ilink diff cl;
    lsmeans vis*task_order / ilink slice=task_order diff cl;
    lsmeans vis*task_order / ilink slicediff=task_order oddsratio cl;
run;


/*========================================================
  1. Create transformed variables from imported dataset
========================================================*/
data BLOSSOM.TIME_DATA;
    set BLOSSOM.CORRECTNESS;

    /* Raw time */
    raw_duration = duration_ms;

    /* Log transform */
    if duration_ms > 0 then log_duration = log(duration_ms);
    else log_duration = .;

    /* Box-Cox transform with lambda = -0.341 */
    if duration_ms > 0 then bc_duration = (duration_ms**(-0.341) - 1)/(-0.341);
    else bc_duration = .;
run;

/* Optional check */
proc means data=BLOSSOM.TIME_DATA n nmiss min max;
    var raw_duration log_duration bc_duration;
run;

/*========================================================
  2. Model 1: Raw duration
========================================================*/
ods output FitStatistics=Fit_Raw
           Tests3=Tests_Raw
           SliceDiffs=SliceDiffs_Raw
           LSMeans=LSMeans_Raw;

proc mixed data=BLOSSOM.TIME_DATA method=reml plots=studentpanel;
    class participant_id vis task_order;
    model raw_duration = vis task_order vis*task_order / solution ddfm=kr;
    random intercept / subject=participant_id;
    lsmeans vis*task_order / slicediff=task_order cl;
run;

/*========================================================
  3. Model 2: Log duration
========================================================*/
ods output FitStatistics=Fit_Log
           Tests3=Tests_Log
           SliceDiffs=SliceDiffs_Log
           LSMeans=LSMeans_Log;

proc mixed data=BLOSSOM.TIME_DATA method=reml plots=studentpanel;
    class participant_id vis task_order;
    model log_duration = vis task_order vis*task_order / solution ddfm=kr;
    random intercept / subject=participant_id;
    lsmeans vis*task_order / slicediff=task_order diff cl;
run;

/*========================================================
  4. Model 3: Box-Cox duration
========================================================*/
ods output FitStatistics=Fit_BoxCox
           Tests3=Tests_BoxCox
           SliceDiffs=SliceDiffs_BoxCox
           LSMeans=LSMeans_BoxCox;

proc mixed data=BLOSSOM.TIME_DATA method=reml plots=studentpanel;
    class participant_id vis task_order;
    model bc_duration = vis task_order vis*task_order / solution ddfm=kr;
    random intercept / subject=participant_id;
    lsmeans vis*task_order / slicediff=task_order cl;
run;

/*========================================================
  5. Label the fit statistics
========================================================*/
data Fit_Raw;
    set Fit_Raw;
    Model = "Raw Duration";
run;

data Fit_Log;
    set Fit_Log;
    Model = "Log Duration";
run;

data Fit_BoxCox;
    set Fit_BoxCox;
    Model = "BoxCox Duration";
run;

/*========================================================
  6. Combine fit statistics for comparison
========================================================*/
data Fit_Compare;
    set Fit_Raw Fit_Log Fit_BoxCox;
run;

proc print data=Fit_Compare;
    title "Comparison of Fit Statistics Across Transformations";
run;

/*========================================================
  7. Label and combine Type III tests
========================================================*/
data Tests_Raw;
    set Tests_Raw;
    Model = "Raw Duration";
run;

data Tests_Log;
    set Tests_Log;
    Model = "Log Duration";
run;

data Tests_BoxCox;
    set Tests_BoxCox;
    Model = "BoxCox Duration";
run;

data Tests_Compare;
    set Tests_Raw Tests_Log Tests_BoxCox;
run;

proc print data=Tests_Compare;
    title "Comparison of Fixed Effects Across Transformations";
run;


proc glimmix data=BLOSSOM.TIME_DATA;
    class participant_id vis task_order;
    model bc_duration = vis task_order vis*task_order / solution ddfm=kr;
    random intercept / subject=participant_id;
    lsmeans vis*task_order / slicediff=task_order cl;
run;

proc glimmix data=BLOSSOM.TIME_DATA;
	class participant_id vis task_order;
	model bc_duration = vis task_order vis*task_order / dist=gaussian solution;
	random intercept / subject=participant_id type=cs;
	lsmeans vis*task_order / slicediff=task_order cl;
run;