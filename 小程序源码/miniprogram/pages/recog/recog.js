// pages/acc/acc.js
const app = getApp()

const innerAudioContext = wx.createInnerAudioContext()
const innerAudioContext0 = wx.createInnerAudioContext()
const innerAudioContext1 = wx.createInnerAudioContext()
const innerAudioContext2 = wx.createInnerAudioContext()
const innerAudioContext3 = wx.createInnerAudioContext()
const innerAudioContext4 = wx.createInnerAudioContext()


//获取数据库引用
const db = wx.cloud.database({ env: 'second-917' });
const accelerometerDB = db.collection('accelerometer')
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capsuleInfo: app.globalData.capsuleInfo,
    value: 0,
    accelerometerX: null,
    accelerometerY: null,
    accelerometerZ: null,
    accXs: [],
    accYs: [],
    accZs: [],
    timeSs: [],
    startTime: 0,
    ans:[],
    timeStep: 0,
    start_num:0,
    setInterId:null,
    peak_total:[],
    info:true,
    name:'',
    age:'',
    height:'',
    weight:'',
    environment:'',
    count_num : {squat: 0 , highStep: 0, jumpingJack: 0 , skiJump: 0},
    minmax_set:[[-2.743077273, -0.518352963], [-0.404787994, 3.555968892], [-0.94638473, 0.465235975], [0.219799284, 3.140370576], [0.077494063, 2.192600274], [0.071618402, 2.378020167], [0.187300666, 2.242155118], [0.064827377, 1.75513429], [0.056584696, 1.647934474], [13.02097723, 94.23384748], [0.003703704, 0.091603053], [0.0, 0.255060729], [0.0, 0.534482759], [0.029268293, 0.526119403], [0.016194332, 0.633064516], [0.012, 0.689243028], [0.007968127, 0.37254902], [0.0, 0.341317365], [0.0, 0.418699187], [0.004504505, 0.320987654], [0.003921569, 0.233480176], [0.0, 0.661290323], [0.0, 0.737051793], [0.0, 0.436], [0.023923445, 0.482213439], [0.0, 0.507177033], [0.0, 0.415322581], [0.0, 0.22], [0.0, 0.184466019], [0.003891051, 0.112403101], [0.003496503, 0.059701493], [0.0, 0.151639344], [0.0, 0.290983607], [0.0, 0.463114754], [0.0, 0.709163347], [0.0, 0.450757576], [0.008196721, 0.758064516], [0.011363636, 0.699186992], [0.0, 0.687747036], [0.003984064, 0.164233577]],
    // , [834.1818182, 1624.4], [875.6363636, 1545.0], [816.5454545, 1540.333333], [0, 3]
    network:[[{'weights': [1.8645375773413766, 2.787694713312568, 1.0946291557646037, 1.2785953885942172, 1.1617485272396402, 0.9400903643131504, 1.6870386102178958, 1.2438753338550776, 0.4738524080275085, 0.47115954119171766, 0.9259771357014642, 0.7480583559049567, 1.0676312480204306, -0.19283847765155918, 0.38745238168895274, 0.8844239540296313, -0.1883139292061524, 0.6259522904638418, 0.3248132037975169, 0.3021512683884548, 0.3043170486214988, 0.5561977105168295, 1.961150232929744, 0.008630833142606362, -0.14745459211829415, -0.17516394597693155, 0.0037328672004576843, -0.9319866251327958, -0.2005393835872349, 0.41752249496943045, 0.17136823163388523, -0.13246192533377374, 0.12230164677704143, 1.012994768112834, 1.5851571828331372, 0.32854095276517997, 0.6388290745172488, -0.19230526390574285, -0.3666380050058219, -0.22237183582248102, -7.0933747477265605], 'output': 0.9617052948568922, 'delta': -1.7163175261953703e-06}, {'weights': [0.8364553822314821, 0.11661598765340099, 0.3231536404269374, 0.7222964565426973, 0.7144619099574853, 0.9376851851611024, 0.4237539646097634, 0.8346748105971913, 0.6729305005233885, 0.30576249688063856, 0.5822975428553404, 0.8783377518524261, 0.8425237817803181, 0.5027402492719124, 0.5880598955458218, 0.02716812564224694, 0.23792675255333504, 0.793092898011446, 0.414131625630775, 0.17077246988742864, 0.547627531299954, 0.7007929385146585, 0.6650679431568811, 0.36832431648190805, 0.43186351429023584, 0.5048517911994729, 0.778639252476735, 0.5256727396395579, 0.39603997799701096, 0.489112178169397, 0.03049763625034244, 0.044991329881279706, 0.7045797314175147, 0.9832589943820704, 0.5860184900978974, 0.395446583053058, 0.1713372790678277, 0.4936297027134814, 0.974225942030995, 0.7650595933805107, -0.07881156752404243], 'output': 0.9992506012669167, 'delta': -1.1897947840738784e-08}, {'weights': [0.8798102748866726, 0.23206032904316126, 0.5251293579980219, 0.9503230313181739, 0.5736526974308704, 0.4580251606979069, 0.26691178354031125, 0.5433859378245495, 0.9554820864181681, 0.004133307110018205, 0.7903990988488413, 0.8251901374847651, 0.8906818487600637, 0.7450236612355325, 0.8125153692531183, 0.5217082320686218, 0.571629664382442, 0.4344920321838856, 0.06064258539397928, 0.871539495885359, 0.57447050273657, 0.20504719048302164, 0.5097738574297207, 0.4965577690066619, 0.3665188780005567, 0.35162883795394956, 0.5393579740564137, 0.6215849263256282, 0.6120748662926204, 0.45847672573138804, 0.02981016903983021, 0.23066445396165106, 0.177324606836045, 0.5846302561314382, 0.8620084337296884, 0.803780137580382, 0.8039968146367383, 0.8258656622046143, 0.26204029028484077, 0.8465012629974394, 1.5180462785764086], 'output': 0.9998802988825186, 'delta': -1.1951124562054688e-09}, {'weights': [3.6655074517786845, -1.2673493704946113, 0.6894381714738602, 0.016403237802592147, 2.16645240456644, -1.8989601099444684, 0.07432592580736676, 2.4031804222010122, -2.0124902376255096, -1.1851967573074575, -1.174481040171925, -0.30525136569094763, -1.7985440246853943, -1.7041195804259774, -2.157275592321211, -1.0503961078275998, 2.2251096445650127, 4.168328357572717, 5.370709010077209, 2.8510560502692326, 1.5689459239750025, 0.35721975583646853, -0.5786935839584177, 0.9680816239088013, -0.05553908706829988, 0.9824533530141533, 1.2334518149900442, 0.5448863861869281, -1.1311492833696388, 0.5506319372463387, -0.6048600524511417, -0.44097484367965284, 1.0555345669459866, 0.23496356708787924, 2.5497654470133138, 2.3022080866868486, 0.30375378139095616, -0.6335631015053902, -0.47225725784021244, -0.6688862667695459, -8.390018359673185], 'output': 0.9972890907744049, 'delta': 1.3950191019762825e-06}, {'weights': [0.3849825906460093, 0.5662396208687357, 0.31998558230495544, 0.6265718432574475, 0.056794282910012955, 0.29599962862983004, 0.9659289914539063, 0.8755697297904826, 0.30529436499497453, 0.8572262276825628, 0.3147500153987107, 0.9433742042975464, 0.7446406005931824, 0.4165759151097122, 0.25381604920098266, -0.00978222567097721, 0.8856809646310503, 0.04431921432158362, 0.825747945422992, 0.9616557833949665, 0.5800992334088185, 0.17750547943993147, 0.8534609724336265, 0.982939190531056, 0.7077587466816344, 0.5050240401139187, 0.37390331510332525, 0.34667060623205775, 0.2076601441004754, 0.671119130161824, 0.4355381725157142, 0.19603785158491976, 0.10577434865883333, 0.6662286330619946, 0.27940983580447987, 0.5162752412295383, 0.33894035940515255, 0.8681560413077363, 0.8914295227058354, 0.011704267986136095, 0.10540685291979812], 'output': 0.9988756531805986, 'delta': -2.7851647366261196e-08}, {'weights': [0.3407282681737614, 0.986292376066543, 0.7924026574570825, 0.33865953228003354, 0.21213994703942232, 0.6744861294248792, 0.8374142586897095, 0.9312788512479665, 0.3437820286896327, 0.8824481932693442, 0.691651378294742, 0.48767786353148446, 0.9884957398294172, 0.2378505616911366, 0.7284015426861343, 0.08667852466951553, 0.1790185437534905, 0.9185669853900468, 0.21723927729568326, 0.7605762763628934, 0.604171440380462, 0.8449901204299218, 0.3705379713006865, 0.34931350720127324, 0.29844148887934496, 0.8722646694488224, 0.6062281256902657, 0.9557289578114251, 0.8883744029772697, 0.13636893159340754, 0.5531387488620985, 0.10536558262973662, 0.03961672531261698, 0.07348251656496027, 0.8657313726637972, 0.7923090053275192, 0.8344057196690384, 0.34954107373260856, 0.6203021158441049, 0.7855300513764968, 1.0604196728325832], 'output': 0.9998310651272875, 'delta': -4.679460343788873e-10}, {'weights': [0.6169629593956132, 0.2267029999411472, 0.10818264124122087, 0.2637510863739997, 0.8830433105389213, 0.5626587454295159, 0.9213266683953921, 0.44881622447867475, 0.27427959391136186, 0.7846335322048084, 0.8488932646166415, 0.026964533359279414, 0.6805889248212754, 0.09869380956305573, 0.1213314608666795, 0.8943304670256654, 0.05914848284558201, 0.2601652461970609, 0.9997568460751612, 0.4243430725772013, 0.13053794979448785, 0.18222345424921543, 0.2588321162687485, 0.7687660297768955, 0.11887006430298841, 0.9186474457794211, 0.3785486602369958, 0.9642794986759792, 0.9065552769458206, 0.2939465851583129, 0.25530278945270274, 0.4794047495261436, 0.100362319509891, 0.6539521865913337, 0.04893934625284654, 0.03356361672875893, 1.0006811243661309, 0.30898599789569003, 0.6033456669745106, 0.45519353242534016, 2.2352281054229], 'output': 0.9996172120291867, 'delta': -2.3960274958930847e-09}, {'weights': [0.08869164020240894, 0.9122382391557335, 0.9898259938643592, 0.9688979763815376, 0.10954792278583797, 0.21553984680177166, 0.6172612731011402, 0.9781380366772321, 0.543006438730936, 0.6886868494538905, 0.6723631684685714, 0.2666724575236421, 0.548776537443223, 0.3145527655549157, 0.2526002993978504, 0.08449520573189914, 0.3006422050052341, 0.9960108801030858, 0.45485685433219625, 0.6539440021003665, 0.6519226603220237, 0.9493415242718876, 0.3954572874736073, 0.3257603599970827, 0.34370268248753755, 0.3250177882993728, 0.8490354987197409, 0.8941255565955434, 0.3046176197259641, 0.33573281507683944, 0.5467627274563922, 0.5809992060711305, 0.5967385733652527, 0.2456628987987726, 0.019117450236965223, 0.2549268147792123, 0.08654255820657124, 0.5646930660668743, 0.0807256831277157, 0.08218550736502464, 1.9876317872152236], 'output': 0.9998230094513814, 'delta': -8.280552478761085e-09}, {'weights': [0.2683503377778334, 0.7859804854721218, 0.4788481081388988, 0.8601818562973473, 0.15461672853556668, 0.4986580009501584, 0.7944224744084789, 0.07899503883588985, 0.9476999803660637, 0.1715717183409648, 0.772209787146477, 0.9831217669998097, 0.8175685512703126, 0.31586407617822454, 0.10337879397661749, 0.49715100541098095, 0.9140652789784932, 0.2905254307303068, 0.8939348892485404, 0.14043912312757492, 0.9108507171427984, 0.02804247340247369, 0.29884008624978486, 0.8976848319470393, 0.7987092832306798, 0.9027796294890691, 0.8389817550227462, 0.7462671505908914, 0.6897464684221458, 0.17571984681168062, 0.43232935624397717, 0.15709671803865752, 0.7147827791183717, 0.6669602651744292, 0.2384251281616755, 0.06568568501826719, 0.9620666006867142, 0.7993278681256549, 0.5418869263656889, 0.5360672903981183, -0.09657707009998434], 'output': 0.9987684057327934, 'delta': -3.778545017188815e-11}, {'weights': [0.6459446434643217, 1.6478226175706094, 0.07511479733948635, 0.7733336018610069, -0.45367575835039825, 1.187755014139173, 0.8266036403136456, -0.04133536290420544, 0.5220371702552661, 0.7608402064794051, 0.3841101893712747, 0.2736576080813597, 0.995968782325583, 1.3968310151864105, 0.792212676252092, 0.4537390907712364, -0.28252133632241866, -0.8249456105544041, -0.7444186535936776, 0.06357010679002165, 0.31063110814980815, 0.757871358243289, 1.0640725931294062, 0.6091484012533092, 0.4600912022501963, -0.121506348142175, 0.32086014034769317, -0.336898299261226, 0.09734877770200591, 0.2748360455710702, 0.44801410586968216, 0.7319013649746786, 0.6026476510318803, 0.38686053317049157, 0.9010172365470941, -0.30407871512846807, 0.3999357310958147, 0.3372786212565479, 0.5621266303024033, 0.15763577986911015, -5.069057524332739], 'output': 0.14386107544366233, 'delta': -1.2206284867577335e-05}, {'weights': [0.8779088163273008, 0.31251498309372816, 0.6882946028360024, 0.8487710771868906, 0.37089998893733944, 0.701187405659334, 0.7360366156652715, 0.5938121615635498, 0.8562254479500705, 0.8964762850572684, 0.9596908332466907, 0.5709941839186664, 0.17555613717867294, 0.249424710139664, 0.21732759608038685, 0.5680848720452534, 0.7523087755095241, 0.04913922301371774, 0.6802106029894525, 0.7162858651809046, 0.3470731353972611, 0.5145067698884153, 0.16419461296033275, 0.7268512902199438, 0.03725475251074454, 0.9786477107292351, 0.8065845647488826, 0.6269016112123585, 0.26676375027926663, 0.912069220192969, 0.9589320755141472, 0.1389365446149362, 0.7755813130418558, 0.842174507362265, 0.6600476806765021, 0.701398719155556, 0.44514907808770715, 0.9188737228592918, 0.9669156339185717, 0.37949434516022357, 0.5398233975603471], 'output': 0.999792915058962, 'delta': -4.600583676941311e-09}, {'weights': [-1.147484231711527, 0.6184942113399973, 0.7981803482035462, 1.793726221540367, 3.5276462479028137, 1.7663650030638378, 1.912072518385698, 3.347151669889573, 1.3567468083083574, 1.529132797637487, -0.23327567943995314, -0.29803197889465716, 0.14752938897481527, -0.5793271630295689, -0.22683119031629245, 1.009977892321143, 0.6821791397647343, 0.9108285510582987, 0.8878350730479972, 0.9368030799912724, 0.6704745986039641, 0.4530911723715337, 0.5584444697708373, -0.5627583442724672, -0.21347376276443583, 0.09130343327171005, 1.1849294207045475, 1.449372283568006, 0.8629395320099268, 1.2615073280201237, -0.385658073042065, 0.27424636432549526, 0.7972046578038368, 0.6243186692584836, 1.1632971844488607, 0.8209914051517154, 0.33265985897232997, -0.24683517052934564, 0.30635712045772817, -0.41032695472229236, -7.007592142764414], 'output': 0.9913549516024047, 'delta': -1.6255775143945735e-06}, {'weights': [6.295528365711721, 6.891016543293002, -0.11269092505030265, 2.457844008552254, -0.07111048908816026, 0.35611633338076765, 2.0459348237649486, -0.5563173143320873, -0.1375079906681559, 0.7619684734202637, 1.333761691820315, 2.1578921190814944, 2.5740674343061296, 1.1456744302807529, -0.6615507942165914, -1.544148842230633, -1.3625361187645126, 0.8185997609491229, 0.2895038465651119, 1.8991023598878858, 0.9368385084710371, 0.16515734336159982, 1.7521536740613075, 0.7209581635594429, 0.4921499722563414, 0.01949705151368081, -0.12129296228674696, -2.8483334959076787, -0.5610322396442764, 1.1907934728849652, 0.29772190219075034, -1.2758239396638649, 0.003899133780176619, 1.6409312669323062, 2.3954526207434967, 0.3962006591429902, 0.7798484143674541, -0.392061620647222, -1.2477283842816977, -0.045268821126290264, -9.590081001964467], 'output': 0.9861585286234671, 'delta': 3.786652780824028e-06}, {'weights': [0.4175832264601115, 0.40029865248675756, 0.8573999670603757, 0.5820554140613682, 0.7323871641576704, 0.896389525305611, 0.7471904584490681, 0.4920882174366117, 0.7449318051968279, 0.6391580887450785, 0.6475195645146017, 0.6288080588688904, 0.4058600418415306, 0.628578009763634, 0.6326962899787637, 0.9302909803060415, 0.7839534054197311, 0.8475995567844858, 0.7691494678656835, 0.8150357459964297, 0.6063055341280289, 0.348782674900888, 0.25760464261963506, 0.7086334558497397, 0.8739201799705891, 0.5437572806715234, 0.15182152407880004, 0.8344636931426601, 0.4851176271395414, 0.4660034965633302, 0.04612167983113967, 0.5105556207726059, 0.7448784784165188, 0.42177746847040354, 0.3480284121557501, 0.6587643076561287, 0.02189511856238291, 0.5059845534762419, 0.944250960797845, 0.688905208565854, 0.18829376246365684], 'output': 0.9996502730305478, 'delta': -3.4163955873171752e-09}],[{'weights': [0.1553265185837218, 0.2641190679521454, -0.18994336995441002, -0.2758035278191041, 0.54356285504539, -0.09734490322800408, -0.29785048682366566, 0.4531182305035609, 0.18400750245499642, -0.5300558315105316, 0.1309838883675853, 8.613476234827735, -9.810280303155317, 0.2835594143287649, -5.056393895207247], 'output': 0.0059392793089575275, 'delta': -3.506553040227915e-05}, {'weights': [3.2012320996585975, -0.20495324286237593, 0.128634604574975, -8.476731367592052, 0.07635351289526879, -0.3082342380071054, 0.317212312988691, 0.38333054483800816, -0.16889833968321374, 2.5504771230199856, 0.4784638890388762, -0.7582206400549927, 6.4119198178583865, -0.45744238557172845, -5.930074412433932], 'output': 0.005930813091181533, 'delta': -3.496593027695817e-05}, {'weights': [3.061423536716262, -0.5976158899478359, -0.5252374241621082, 9.099507239989903, -0.1318137877381025, -0.734709271856215, -0.24230437259915036, -0.757320706904249, 0.022927321571784717, -1.238120450796173, -0.03818273684184614, 3.7069084402582444, 6.827827458724332, -0.6854371682265077, -13.229138388500715], 'output': 0.9951849306089982, 'delta': 2.3073256370388546e-05}, {'weights': [-3.871521394724361, 0.08289066197906149, 0.7520890206810302, 0.7759410914481532, 0.7190524697702855, 0.2175746825061811, 0.6070230373967397, 0.7066443220598753, 0.3168525850161182, -1.5214752975853334, 0.41184485361474577, -8.734198186209264, -1.9147571239707426, 0.19516164529204405, 1.146933188023189], 'output': 0.00019137536369093092, 'delta': -3.6617520795120267e-08}]]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    innerAudioContext.autoplay = false
    innerAudioContext0.autoplay = false
    innerAudioContext1.autoplay = false
    innerAudioContext2.autoplay = false
    innerAudioContext3.autoplay = false

    innerAudioContext.src = 'cloud://second-917.7365-second-917-1302086118/开始人声.m4a'
    innerAudioContext0.src = 'cloud://second-917.7365-second-917-1302086118/高抬腿1.m4a'
    innerAudioContext1.src = 'cloud://second-917.7365-second-917-1302086118/开合跳1.m4a'
    innerAudioContext2.src = 'cloud://second-917.7365-second-917-1302086118/滑雪跳1.m4a'
    innerAudioContext3.src = 'cloud://second-917.7365-second-917-1302086118/深蹲1.m4a'
    innerAudioContext4.src = 'cloud://second-917.7365-second-917-1302086118/结束.m4a'

    console.log("获取加速度计数据"),
    wx.startAccelerometer({
      interval: 'normal',   //200ms/次
      success: res => { console.log("调用成功"); },
      fail: res => { console.log(res) }
    });
  },
  inputName(event) {
    this.setData({
      name: event.detail.value
    })
  },
  inputAge(event) {
    this.setData({
      age: event.detail.value
    })
  },
  inputHeight(event) {
    this.setData({
      height: event.detail.value
    })
  },
  inputWeight(event) {
    this.setData({
      weight: event.detail.value
    })
  },
  inputEnvironment(event) {
    this.setData({
      environment: event.detail.value
    })
  },
  enter(){
    this.setData({
      info: false
    })
  },


  Try_again(){
    let _this = this
    _this.setData({ isReading: true })
    _this.setData({count_num: {
      squat:0,
      jumpingJack:0,
      highStep:0,
      skiJump:0
    }})

    innerAudioContext.play()
    _this.data.setInterId = setInterval(_this.startAccelerometer,"6000");
  
  },



  startAccelerometer: function (e) {
    this.setData({ startTime: new Date().getTime()})
    
    let _this = this;
    let start_num = _this.data.start_num

    start_num = start_num + 1
    _this.setData({start_num: start_num})
    

    let accXs = _this.data.accXs
    let accYs = _this.data.accYs
    let accZs = _this.data.accZs
    let timeSs = _this.data.timeSs

    let time_index = 0;
    // console.log("识别次数",start_num)

    // 监听加速度数据
    wx.onAccelerometerChange(function (res) {
      let mid_time = new Date().getTime();
      console.log("mid-time: ", mid_time, "startTime: ", _this.data.startTime)
      // console.log(res.x, res.y, res.z, mid_time ,time_index)

      let timeStep = (mid_time - _this.data.startTime) / 1000
      _this.setData({ value: parseInt(timeStep * 10 / 3), displayValue: parseInt(timeStep)})

      if(time_index != 100 ){
        let accXs = _this.data.accXs
        let accYs = _this.data.accYs
        let accZs = _this.data.accZs
        let timeSs = _this.data.timeSs

        console.log("搜集中...")
        // console.log("xyz",accXs,_this.data.accXs)

        accXs.push(res.x)
        accYs.push(res.y)
        accZs.push(res.z)
        timeSs.push(mid_time)
        time_index = time_index + 1
        
        _this.setData({ accXs: accXs, accYs: accYs, accZs: accZs, timeSs: timeSs })
        _this.setData({
          accelerometerX: parseFloat(res.x.toFixed(5)),
          accelerometerY: parseFloat(res.y.toFixed(5)),
          accelerometerZ: parseFloat(res.z.toFixed(5))
        })
        console.log(res.x, res.y, res.z, mid_time,timeStep,time_index )

      }
      console.log('sn',start_num)
        if(start_num > 5) {

          _this.stopAccelerometer();

          clearInterval(_this.data.setInterId)
          innerAudioContext4.play()
          _this.setData({ isReading: false })
          console.log("识别结束")

          let peak_total = _this.data.peak_total
          console.log('峰值点',peak_total)
  

          start_num = 0
          _this.setData({start_num: start_num})
        } else if(time_index == 100){
        var prediction = 0
        console.log("即将识别该组...")

        prediction = _this.Judgement();

        console.log("X",accXs)
        console.log("Y",accYs)
        console.log("Z",accZs)

        if(prediction == 0) {
          innerAudioContext0.play()
          var flag = []
          var num = 0
         
          flag.push(_this.count(accXs))
          flag.push(_this.count(accYs))
          flag.push(_this.count(accZs))

          num = Math.min.apply(null, flag)
          let total_old = _this.data.count_num.highStep
          let squat_num = _this.data.count_num.squat
          let jumpingJack_num = _this.data.count_num.jumpingJack
          let skiJump_num = _this.data.count_num.skiJump

          var sum=0;
          for(var i = 0; i < flag.length; i++){
              sum += flag[i];
          }
          var mean  = sum / flag.length;
           _this.setData({count_num:{
             squat: squat_num,
             jumpingJack: jumpingJack_num,
             skiJump: skiJump_num,
             highStep: total_old + 2*parseInt(mean)
           }})  
        } else if(prediction == 1) {
          innerAudioContext1.play()
 
          var flag = []
          var num = 0
         
          flag.push(_this.count(accXs))
          flag.push(_this.count(accYs))
          flag.push(_this.count(accZs))

          num = Math.min.apply(null, flag)
          let total_old = _this.data.count_num.jumpingJack
          let squat_num = _this.data.count_num.squat
          let highStep_num = _this.data.count_num.highStep
          let skiJump_num = _this.data.count_num.skiJump
          var sum=0;
          for(var i = 0; i < flag.length; i++){
              sum += flag[i];
          }
          var mean  = sum / flag.length;
           _this.setData({
            count_num:{
              squat: squat_num,
              jumpingJack: total_old + parseInt(mean),
              skiJump: skiJump_num,
              highStep: highStep_num
            }
          })    
        } else if (prediction == 2) {
          innerAudioContext2.play()
          var flag = []
          var num = 0
         
          flag.push(_this.count(accXs))
          flag.push(_this.count(accYs))
          flag.push(_this.count(accZs))

          num = Math.min.apply(null, flag)
          let total_old = _this.data.count_num.skiJump
          let squat_num = _this.data.count_num.squat
          let highStep_num = _this.data.count_num.highStep
          let jumpingJack_num = _this.data.count_num.jumpingJack

   
          if(num <= 4){
            _this.setData({
              count_num:{
                squat: squat_num,
                jumpingJack: jumpingJack_num,
                skiJump: total_old + num,
                highStep: highStep_num
              }})
            // _this.setData({count_num:{skiJump:total_old + num}})
          } else {
            _this.setData({
              count_num:{
                squat: squat_num,
                jumpingJack: jumpingJack_num,
                skiJump: total_old + 4,
                highStep: highStep_num
              }})
          }

        } else if(prediction == 3) {
          innerAudioContext3.play()
          var flag = []
          var num = 0
         
          flag.push(_this.count(accXs))
          flag.push(_this.count(accYs))
          flag.push(_this.count(accZs))

          num = Math.min.apply(null, flag)
          let total_old = _this.data.count_num.squat
          let skiJump_num = _this.data.count_num.skiJump
          let highStep_num = _this.data.count_num.highStep
          let jumpingJack_num = _this.data.count_num.jumpingJack

          // _this.setData({count_num:{squat:total_old + num}})
          if(num <= 4){
            _this.setData({
              count_num:{
              squat: total_old + num,
              jumpingJack: jumpingJack_num,
              skiJump: skiJump_num,
              highStep: highStep_num
            }})
          } else {
            _this.setData({
              count_num:{
                squat: total_old + 4,
                jumpingJack: jumpingJack_num,
                skiJump: skiJump_num,
                highStep: highStep_num
              }})
          }

        }
        console.log('prediction在总函数里',prediction)
        _this.stopAccelerometer();

        _this.setData({ accXs: [], accYs: [], accZs: [], timeSs: [] })

      }
    
    })
  // }

      
      
      return;
    
  },

  stopAccelerometer: function () {
    let _this = this
    // _this.setData({ isReading: false })
    wx.stopAccelerometer({
      success: res => {
        console.log("停止读取")
        _this.setData({ accelerometerX: null, accelerometerY: null, accelerometerZ: null, activity: null })
      }
    })
    wx.offAccelerometerChange()
  },

  Judgement(){
    console.log("识别中...")
    let _this = this
    let accXs = _this.data.accXs, accYs = _this.data.accYs, accZs = _this.data.accZs
    var prediction = 0

    prediction = _this.Try(accXs,accYs,accZs)
    _this.setData({
      accXs:[],
      accYs:[],
      accZs:[],
      timeSs:[]
    })
    return prediction

  },

  saveAcc() {
    console.log("save...")
    let count_num = this.data.count_num
    let name =  this.data.name
    let age = this.data.age
    let height = this.data.height
    let weight = this.data.weight
    let environment = this.data.environment
    let _this = this

    accelerometerDB.add({
      data: { 
        name: name,
        age: age,
        height: height,
        weight: weight,
        environment: environment,
        outcome: count_num
      }
    })
      .then(res => { console.log("保存成功") ;
        wx.showToast({
          title: '保存成功',
        })
        _this.setData({count_num: {
          squat:0,
          jumpingJack:0,
          highStep:0,
          skiJump:0
        }})
        
      })
      .catch(res => { console.log("保存失败") })
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  Try(df_x,df_y,df_z){

    this.average(df_x)
    this.average(df_y)
    this.average(df_z)

    this.standardDeviation(df_x,this.data.ans,0)
    this.standardDeviation(df_y,this.data.ans,1)
    this.standardDeviation(df_z,this.data.ans,2)

    this.averageAbsoluteDifference(df_x,this.data.ans,0)
    this.averageAbsoluteDifference(df_y,this.data.ans,1)
    this.averageAbsoluteDifference(df_z,this.data.ans,2)

    var total = 0
    var ans = this.data.ans
    total = this.averageResultantAcceleration(df_x,total)
    total = this.averageResultantAcceleration(df_y,total)
    total = this.averageResultantAcceleration(df_z,total)
    total = total ** 0.5
    ans.push(total)
    this.setData({
      ans:ans
    })
    // console.log('10ans',this.data.ans)

    var ans_bd = []
    ans_bd = this.binnedDistribution(df_x)
    ans = ans.concat(ans_bd)
    // console.log("ans1",ans)
    ans_bd = this.binnedDistribution(df_y)
    ans = ans.concat(ans_bd)
    ans_bd = this.binnedDistribution(df_z)
    ans = ans.concat(ans_bd)
    this.setData({
      ans:ans
    })
    // console.log('anstotal',this.data.ans)
    ans = this.normalize_dataset(ans, this.data.minmax_set)
    this.setData({
      ans:ans
    })
    // console.log('normal',this.data.ans)

    var predict_data = [ans]
    for(var i=0; i< predict_data.length; i++){
      var prediction = 0
      prediction = this.predict(this.data.network, predict_data[i])

      // console.log('prediction语音前',prediction)
    console.log('prediction',prediction)
    this.setData({
      accXs:[],
      accYs:[],
      accZs:[],
      timeSs:[]
    })
    this.setData({
      ans:[]
    })
    return prediction


  }
},

  average(dataset){
    var sum = 0
    var average = 0
    var ans = this.data.ans
    for(var i=0; i< dataset.length; i++){
      sum = sum + dataset[i]
    }
    average = sum/ dataset.length
    ans.push(average)
    // console.log('average',average)
    this.setData({
      ans:ans
    })
    // console.log('ans',ans)
  },
  standardDeviation(dataset,ans,tag){
    var sum = 0
    var standardDeviation = 0
    var ans = this.data.ans
    for(var i=0; i< dataset.length; i++){
      sum = sum + (dataset[i] - this.data.ans[tag])** 2
    }  
    standardDeviation = (sum/dataset.length)** 0.5
    ans.push(standardDeviation)
    this.setData({
      ans:ans
    })
    // console.log('ans',ans)
  },

  averageAbsoluteDifference(dataset,ans,tag){
    var sum = 0
    var diff = 0
    var averageAbsoluteDifference = 0
    var ans = this.data.ans

    for(var i=0; i< dataset.length; i++){
      // 0-x  1-y  2-z
      diff =  dataset[i] - this.data.ans[tag]
      if(diff >= 0){
        sum = sum + diff
      } else {
        sum = sum - diff
      }
    }
    averageAbsoluteDifference = sum / dataset.length
    ans.push(averageAbsoluteDifference)
    this.setData({
      ans:ans
    })
    // console.log('ans',ans)
  },

  averageResultantAcceleration(dataset,total){
    for(var i=0; i<dataset.length; i++){
      total = total + dataset[i] ** 2
    }
    return total
  },

  binnedDistribution(dataset){
    var value_min = Math.max.apply(null, dataset);
    var value_max = Math.min.apply(null, dataset);
    var minmax = [value_min, value_max]
    var flag = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
    // console.log('minmax',minmax)

    for(var i =0; i< dataset.length; i++){
      dataset[i] = ((dataset[i] - minmax[1]) / (minmax[0] - minmax[1]))

      if(dataset[i] > 0.9){
        flag[9] = flag[9] + 1.0       
      } else if(dataset[i] > 0.8){
        flag[8] = flag[8] + 1.0 
      } else if(dataset[i] > 0.7){
        flag[7] = flag[7] + 1.0       
      } else if(dataset[i] > 0.6){
        flag[6] = flag[6] + 1.0
       }else if(dataset[i] > 0.5){
        flag[5] = flag[5] + 1.0     
      } else if(dataset[i] > 0.4){
        flag[4] = flag[4] + 1.0
      } else if(dataset[i] > 0.3){
        flag[3] = flag[3] + 1.0
      }else if(dataset[i] > 0.2){
        flag[2] = flag[4] + 1.0
      }else if(dataset[i] > 0.1){
        flag[1] = flag[1] + 1.0
      } else {
        flag[0] = flag[0] + 1.0
      }
    }
    for(var i=0; i<10; i++){
      // console.log('flagi',flag[i])
      flag[i] = flag[i] / dataset.length
    }
    // console.log('flag',flag)
    return flag 
},

normalize_dataset(ans_set, minmax){
  for(var i=0; i<ans_set.length; i++){
    ans_set[i] = (ans_set[i] - minmax[i][0]) / (minmax[i][1] - minmax[i][0])
  }
  return ans_set
},

forward_propagate(network, row){
  var inputs = row
  // console.log('inputs',inputs)

  for(var i=0; i< network.length; i++){
    var new_inputs = []

    for(var j=0; j< network[i].length; j++){
      var weights = network[i][j].weights
      var activation = weights[weights.length -1]
      for(var k=0; k< ((weights.length) -1); k++){
        activation = activation + weights[k] * inputs[k]
      }
      // console.log('激活前',activation)
      network[i][j].output = 1.0/(1.0 + Math.exp(-activation))
      // console.log('激活后',network[i][j].output)
      new_inputs.push(network[i][j].output)
    }
    inputs = new_inputs
    // console.log('new_int',inputs)
  }
  return inputs
},

predict(network,row){
  // console.log('net',network)
  var outputs = this.forward_propagate(network,row)
  // console.log('out',outputs)
  var outputs_index = outputs.indexOf(Math.max.apply(null, outputs))
  // console.log('pre',outputs_index)
  return outputs_index
},


count(acc){
  let _this = this
  // let peak_total = _this.data.peak_total
  var acc_get=[]

  for(var i=0; i < acc.length; i = i+4){
    acc_get[i/4] = acc[i]

  }
  console.log('提取后的acc',acc_get)

  let acc_len = acc_get.length

  var diff_v = (new Array(acc_len -1)).fill(0)
  var peak = []

  for(var i=0; i != diff_v.length; i++){
    if(acc_get[i+1] - acc_get[i] >0){
      diff_v[i] = 1
    } else if(acc_get[i + 1] - acc_get[i] < 0) {
      diff_v[i] = -1
    } else {
      diff_v[i] = 0
    }
  }
  // console.log('第一次',diff_v)

  for(var i = diff_v.length -1; i>= 0; i-- ){
    if(diff_v[i] == 0 && i == diff_v.length - 1) {
      diff_v[i] = 1
    } else if (diff_v[i] == 0) {
      if (diff_v[i + 1] >= 0){
        diff_v[i] = 1;
      } else {
        diff_v[i] = -1;
      } 
    }
  }
  // console.log('二阶差分',diff_v)

  for(var i=0; i != diff_v.length -1 ;i++){
    if(diff_v[i+1] - diff_v[i] == -2){
      peak.push(i+1)
    }
  }
  console.log('peak峰值点',peak)
  console.log("个数",peak.length)

  // peak_total.push(peak.length)
  return peak.length

  // _this.setData({peak_total: peak_total})
}
})