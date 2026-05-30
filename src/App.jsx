import { useState, useCallback, useEffect } from "react"
import Logo from "./Logo"
import { ethers } from "ethers"
import "./index.css"

const CA = "0x29c57355C070f27E54cF499114EeC8F3865f0321"
const HIDDEN_IDS = [1, 2, 3, 4]
const CHAIN = {chainId:"0x3d8",chainName:"OPN Testnet",rpcUrls:["https://testnet-rpc.iopn.tech"],nativeCurrency:{name:"Test OPN",symbol:"OPN",decimals:18},blockExplorerUrls:["https://testnet.iopn.tech"]}
const ABI = ["function nextPropertyId() view returns(uint256)","function getProperty(uint256) view returns(tuple(string name,string location,uint256 totalValue,uint256 totalShares,uint256 pricePerShare,bool active))","function balanceOf(address,uint256) view returns(uint256)","function buyShares(uint256,uint256) payable","function listProperty(string,string,uint256,uint256,uint256) returns(uint256)","function owner() view returns(address)","event TransferSingle(address indexed operator,address indexed from,address indexed to,uint256 id,uint256 value)"]
const PEXELS_KEY = "AoK9xjNdpaZqx4xO2UhgDhFsPrQECR4NKngZq0WWs31QIMW3VTVqx5hN"
const FALLBACK_IMG = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
const EXPLORER = "https://testnet.iopn.tech"

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img skeleton"/>
      <div className="skeleton-body">
        <div className="skeleton-tag skeleton"/>
        <div className="skeleton-title skeleton"/>
        <div className="skeleton-loc skeleton"/>
        <div className="skeleton-divider"/>
        {[1,2,3].map(i=>(
          <div className="skeleton-row" key={i}>
            <div className="skeleton-row-key skeleton"/>
            <div className="skeleton-row-val skeleton"/>
          </div>
        ))}
        <div className="skeleton-btn skeleton"/>
      </div>
    </div>
  )
}

export default function App() {
  const [wallet,setWallet]=useState(null)
  const [contract,setContract]=useState(null)
  const [props,setProps]=useState([])
  const [loading,setLoading]=useState(false)
  const [tx,setTx]=useState({})
  const [shares,setShares]=useState({})
  const [tab,setTab]=useState("market")
  const [isOwner,setIsOwner]=useState(false)
  const [showWalletMenu,setShowWalletMenu]=useState(false)

  useEffect(()=>{
    const handler=(e)=>{
      if(!e.target.closest(".wallet-menu")) setShowWalletMenu(false)
    }
    document.addEventListener("mousedown",handler)
    return()=>document.removeEventListener("mousedown",handler)
  },[])
  const [form,setForm]=useState({name:"",location:"",totalValue:"1",totalShares:"1000",pricePerShare:"0.001"})
  const [amt,setAmt]=useState({})
  const [propImgs,setPropImgs]=useState({})
  const [detail,setDetail]=useState(null)
  const [detailTxs,setDetailTxs]=useState([])
  const [detailHolders,setDetailHolders]=useState([])
  const [detailLoading,setDetailLoading]=useState(false)

  const load = useCallback(async(c,addr)=>{
    setLoading(true)
    try{
      const total=Number(await c.nextPropertyId())
      const ps=[],sh={}
      for(let i=0;i<total;i++){
        const p=await c.getProperty(i)
        if(!HIDDEN_IDS.includes(i)) ps.push({id:i,name:p.name,location:p.location,totalValue:p.totalValue,totalShares:p.totalShares,pricePerShare:p.pricePerShare,active:p.active})
        if(addr) sh[i]=Number(await c.balanceOf(addr,i))
      }
      const imgs={}
      for(const p of ps){
        try{
          const q=encodeURIComponent(p.name+" "+p.location)
          const r=await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=1`,{headers:{Authorization:PEXELS_KEY}})
          const d=await r.json()
          imgs[p.id]=d.photos?.[0]?.src?.large||FALLBACK_IMG
        }catch(e){imgs[p.id]=FALLBACK_IMG}
      }
      setProps(ps);setShares(sh);setPropImgs(imgs)
    }catch(e){console.error(e)}
    setLoading(false)
  },[])

  async function connect(){
    if(!window.ethereum) return alert("Please install MetaMask!")
    try{
      await window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x3d8"}]}).catch(async()=>window.ethereum.request({method:"wallet_addEthereumChain",params:[CHAIN]}))
      const p=new ethers.BrowserProvider(window.ethereum)
      const s=await p.getSigner()
      const addr=await s.getAddress()
      const c=new ethers.Contract(CA,ABI,s)
      setWallet(addr);setContract(c)
      setIsOwner((await c.owner()).toLowerCase()===addr.toLowerCase())
      load(c,addr)
    }catch(e){console.error(e)}
  }

  function disconnect(){
    setWallet(null);setContract(null);setIsOwner(false)
    setProps([]);setShares({});setPropImgs({})
    setTab("market")
  }

  async function buy(id,a){
    if(!contract||!a||a<=0) return
    const parsed=Math.floor(Number(a))
    if(!parsed||parsed<=0) return
    const prop=props.find(p=>p.id===id)
    const cost=prop.pricePerShare*BigInt(parsed)
    setTx(t=>({...t,[id]:"pending"}))
    try{
      const t=await contract.buyShares(id,a,{value:cost})
      setTx(s=>({...s,[id]:"waiting"}));await t.wait()
      setTx(s=>({...s,[id]:"success"}));load(contract,wallet)
      if(detail&&detail.id===id) openDetail(prop)
    }catch(e){setTx(s=>({...s,[id]:"error"}))}
    setTimeout(()=>setTx(s=>({...s,[id]:""})),3000)
  }

  async function listProp(){
    if(!contract||!isOwner) return
    const{name,location,totalValue,totalShares,pricePerShare}=form
    if(!name||!location||!totalValue||!totalShares||!pricePerShare) return alert("Please fill in all fields")
    setTx(t=>({...t,list:"pending"}))
    try{
      const t=await contract.listProperty(name,location,ethers.parseEther(totalValue),BigInt(totalShares),ethers.parseEther(pricePerShare))
      await t.wait();setTx(s=>({...s,list:"success"}))
      setForm({name:"",location:"",totalValue:"1",totalShares:"1000",pricePerShare:"0.001"});load(contract,wallet)
    }catch(e){setTx(s=>({...s,list:"error"}))}
    setTimeout(()=>setTx(s=>({...s,list:""})),3000)
  }

  async function openDetail(p){
    setDetail(p)
    setTab("detail")
    setDetailLoading(true)
    setDetailTxs([])
    setDetailHolders([])
    try{
      const txRes=await fetch(`${EXPLORER}/api/v2/addresses/${CA}/transactions?filter=to`)
      if(txRes.ok){
        const txData=await txRes.json()
        setDetailTxs((txData.items||[]).slice(0,8))
      }
    }catch(e){console.error(e)}
    if(contract){
      try{
        const filter=contract.filters.TransferSingle(null,null,null,p.id,null)
        const events=await contract.queryFilter(filter,-50000)
        const holderMap={}
        for(const ev of events){
          const to=ev.args[2]
          if(to!==ethers.ZeroAddress) holderMap[to]=(holderMap[to]||0)+Number(ev.args[4])
        }
        const holderList=[]
        for(const [addr] of Object.entries(holderMap)){
          try{
            const bal=Number(await contract.balanceOf(addr,p.id))
            if(bal>0) holderList.push({addr,bal})
          }catch(e){}
        }
        holderList.sort((a,b)=>b.bal-a.bal)
        setDetailHolders(holderList.slice(0,10))
      }catch(e){console.error(e)}
    }
    setDetailLoading(false)
  }

  function disconnect(){
    setWallet(null);setContract(null);setProps([]);setShares({});setIsOwner(false);setTab("market");setShowWalletMenu(false)
  }
  const fmt=wei=>parseFloat(ethers.formatEther(wei)).toFixed(4)
  const totalOwned=Object.values(shares).reduce((a,b)=>a+b,0)
  const mapUrl=p=>`https://maps.google.com/maps?q=${encodeURIComponent(p.location)}&output=embed`

  return(
    <div className="content">
      <div className="hero-glow"/>
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <Logo size={36}/>
            <span className="logo-text">OPN<span>fi</span></span>
          </div>
          <div className="nav-links">
            <button className={"nav-link"+(tab==="market"?" active":"")} onClick={()=>setTab("market")}>Market</button>
            <button className={"nav-link"+(tab==="portfolio"?" active":"")} onClick={()=>setTab("portfolio")}>Portfolio</button>
            <button className={"nav-link"+(tab==="faucet"?" active":"")} onClick={()=>setTab("faucet")}>Faucet</button>
            <button className={"nav-link"+(tab==="about"?" active":"")} onClick={()=>setTab("about")}>About</button>
            {isOwner&&<button className={"nav-link admin"+(tab==="admin"?" active":"")} onClick={()=>setTab("admin")}>Admin</button>}
          </div>
          {wallet
            ? <div className="wallet-menu" style={{position:"relative"}}>
                <button className="btn-connect connected" onClick={()=>setShowWalletMenu(v=>!v)}>
                  <span className="wallet-dot"/>
                  {wallet.slice(0,6)+"..."+wallet.slice(-4)}
                </button>
                {showWalletMenu&&<div className="wallet-dropdown">
                  <div className="wallet-dropdown-addr">{wallet.slice(0,10)}...{wallet.slice(-6)}</div>
                  <button className="wallet-dropdown-item" onClick={()=>{navigator.clipboard.writeText(wallet);setShowWalletMenu(false)}}>📋 Copy Address</button>
                  <a className="wallet-dropdown-item" href={`${EXPLORER}/address/${wallet}`} target="_blank" onClick={()=>setShowWalletMenu(false)}>🔍 View on Explorer</a>
                  <div className="wallet-dropdown-divider"/>
                  <button className="wallet-dropdown-item disconnect" onClick={disconnect}>✕ Disconnect</button>
                </div>}
              </div>
            : <button className="btn-connect" onClick={connect}>Connect Wallet</button>
          }
        </div>
      </nav>

      {tab==="market"&&<>
        <div className="hero">
          <div className="badge"><span className="badge-dot"/>{CA.slice(0,10)}... · OPN Testnet</div>
          <h1>Real World Assets<br/><span className="grad">On-Chain</span></h1>
          <p>Tokenize real properties on OPN Chain. Buy fractional ownership — fully transparent and verifiable on the blockchain.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={()=>document.getElementById("props")?.scrollIntoView({behavior:"smooth"})}>View Properties</button>
            <a className="btn-secondary" href={"https://testnet.iopn.tech/address/"+CA} target="_blank">View Contract ↗</a>
          </div>
        </div>
        <div className="stats">
          <div className="stats-inner">
            {[{l:"Properties Listed",v:props.length},{l:"Your Shares",v:totalOwned},{l:"Network",v:"OPN Testnet"},{l:"Chain ID",v:"984"}].map(s=>(
              <div className="stat" key={s.l}><div className="stat-val">{s.v}</div><div className="stat-label">{s.l}</div></div>
            ))}
          </div>
        </div>
        <div className="section" id="props">
          <div className="section-head section-head-row">
            <div><h2>Available Properties</h2><p>Buy shares directly via smart contract on-chain</p></div>
            {wallet&&<button className="btn-secondary" style={{fontSize:13}} onClick={()=>load(contract,wallet)}>Refresh</button>}
          </div>

          <div className="grid3">
            {loading
              ? Array.from({length:3}).map((_,i)=><SkeletonCard key={i}/>)
              : props.map((p)=>(
                <div className="card" key={p.id} onClick={()=>openDetail(p)} style={{cursor:"pointer"}}>
                  <div className="card-img"><img src={propImgs[p.id]||FALLBACK_IMG} alt={p.name}/></div>
                  <div className="card-body">
                    <span className="card-tag">Property #{p.id}</span>
                    <div className="card-title">{p.name||"—"}</div>
                    <div className="card-loc">📍 {p.location||"—"}</div>
                    <div className="card-rows">
                      <div className="card-row"><span className="card-row-key">Total Value</span><span className="card-row-val">{fmt(p.totalValue)} OPN</span></div>
                      <div className="card-row"><span className="card-row-key">Price / Share</span><span className="card-row-val accent">{fmt(p.pricePerShare)} OPN</span></div>
                      <div className="card-row"><span className="card-row-key">Total Shares</span><span className="card-row-val">{Number(p.totalShares).toLocaleString()}</span></div>
                      {shares[p.id]>0&&<div className="card-row"><span className="card-row-key">Your Shares</span><span className="card-row-val green">{shares[p.id]}</span></div>}
                    </div>
                    <div className="card-view-btn">View Details →</div>
                  </div>
                </div>
              ))
            }
          </div>

          {!loading&&props.length===0&&(
            <div className="empty">
              <div className="empty-title">{wallet?(isOwner?"Add properties in the Admin panel":"No properties listed yet"):"Connect your wallet to view data"}</div>
            </div>
          )}
        </div>
      </>}

      {tab==="detail"&&detail&&<div className="page">
        <div className="detail-wrap">
          <button className="detail-back" onClick={()=>setTab("market")}>← Back to Market</button>
          <div className="detail-hero-img">
            <img src={propImgs[detail.id]||FALLBACK_IMG} alt={detail.name}/>
            <div className="detail-hero-overlay">
              <span className="card-tag">Property #{detail.id}</span>
              <h1 className="detail-title">{detail.name}</h1>
              <div className="detail-loc">📍 {detail.location}</div>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-left">
              <div className="detail-card">
                <div className="detail-card-title">Property Details</div>
                <div className="detail-stats-grid">
                  {[
                    {l:"Total Value",v:fmt(detail.totalValue)+" OPN"},
                    {l:"Price / Share",v:fmt(detail.pricePerShare)+" OPN"},
                    {l:"Total Shares",v:Number(detail.totalShares).toLocaleString()},
                    {l:"Your Shares",v:shares[detail.id]||0},
                    {l:"Status",v:detail.active?"🟢 Active":"🔴 Inactive"},
                    {l:"Contract",v:CA.slice(0,8)+"..."+CA.slice(-4)},
                  ].map(s=>(
                    <div className="detail-stat-row" key={s.l}>
                      <span className="detail-stat-key">{s.l}</span>
                      <span className="detail-stat-val">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {detail.active&&<div className="detail-card">
                <div className="detail-card-title">Buy Shares</div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:16}}>1 share = {fmt(detail.pricePerShare)} OPN</p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Number of shares (min. 1)"
                    value={amt[detail.id]||""}
                    onChange={e=>setAmt(a=>({...a,[detail.id]:e.target.value}))}
                    style={{flex:1,minWidth:140,borderColor:amt[detail.id]&&Number(amt[detail.id])<1?"var(--red)":""}}
                  />
                  <button
                    className="btn-list"
                    onClick={()=>buy(detail.id,Number(amt[detail.id]))}
                    disabled={!wallet||tx[detail.id]==="pending"||tx[detail.id]==="waiting"||!amt[detail.id]||Number(amt[detail.id])<1}
                    style={{minWidth:130}}
                  >
                    {!wallet?"Connect Wallet":tx[detail.id]==="pending"?"...":(tx[detail.id]==="waiting"?"⏳ Waiting...":(tx[detail.id]==="success"?"✓ Success!":(tx[detail.id]==="error"?"✗ Failed":"Buy Shares")))}
                  </button>
                </div>
                <div style={{marginTop:8,fontSize:12,color:"rgba(255,255,255,0.35)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                  <span>Minimum purchase: <span style={{color:"var(--cyan)"}}>1 share = {fmt(detail.pricePerShare)} OPN</span></span>
                  {amt[detail.id]&&Number(amt[detail.id])<1&&<span style={{color:"var(--red)"}}>⚠ Minimum 1 share</span>}
                </div>
                {amt[detail.id]>=1&&<div style={{marginTop:6,fontSize:13,color:"rgba(255,255,255,0.4)"}}>
                  Total: <span style={{color:"var(--text)",fontWeight:500}}>{(parseFloat(fmt(detail.pricePerShare))*Number(amt[detail.id]||0)).toFixed(4)} OPN</span>
                </div>}
              </div>}

              <div className="detail-card">
                <div className="detail-card-title">Top Holders</div>
                {detailLoading&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Loading holders...</div>}
                {!detailLoading&&detailHolders.length===0&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>No holders found yet</div>}
                {detailHolders.map((h,i)=>(
                  <div className="holder-row" key={h.addr}>
                    <span className="holder-rank">#{i+1}</span>
                    <a className="holder-addr" href={`${EXPLORER}/address/${h.addr}`} target="_blank">{h.addr.slice(0,8)}...{h.addr.slice(-6)}</a>
                    <span className="holder-bal">{h.bal} shares</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-right">
              <div className="detail-card" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"16px 20px 12px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                  <div className="detail-card-title" style={{margin:0}}>📍 Location Map</div>
                </div>
                <iframe src={mapUrl(detail)} width="100%" height="300" style={{border:"none",display:"block"}} allowFullScreen loading="lazy" title="map"/>
                <div style={{padding:"12px 20px"}}>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(detail.location)}`} target="_blank" className="link-explorer">Open in Google Maps ↗</a>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-card-title">Recent Transactions</div>
                {detailLoading&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Loading...</div>}
                {!detailLoading&&detailTxs.length===0&&(
                  <div>
                    <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:12}}>No transaction data available</div>
                    <a href={`${EXPLORER}/address/${CA}?tab=txs`} target="_blank" className="link-explorer">View on Explorer ↗</a>
                  </div>
                )}
                {detailTxs.map((t,i)=>(
                  <div className="tx-row" key={i}>
                    <div className="tx-info">
                      <span className="tx-method">{t.method||t.decoded_input?.method_call?.split("(")?.[0]||"Tx"}</span>
                      <span className="tx-addr">{t.from?.hash?.slice(0,8)}...{t.from?.hash?.slice(-4)}</span>
                    </div>
                    <div className="tx-right">
                      <span className="tx-val">{t.value&&t.value!=="0"?parseFloat(ethers.formatEther(t.value)).toFixed(4)+" OPN":""}</span>
                      <a href={`${EXPLORER}/tx/${t.hash}`} target="_blank" className="tx-link">↗</a>
                    </div>
                  </div>
                ))}
                {detailTxs.length>0&&<a href={`${EXPLORER}/address/${CA}?tab=txs`} target="_blank" className="link-explorer" style={{marginTop:12,display:"block"}}>View all on Explorer ↗</a>}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {tab==="faucet"&&<div className="page">
        <div className="faucet-wrap">
          <div className="faucet-header">
            <div className="faucet-icon">💧</div>
            <h1>OPN Testnet Faucet</h1>
            <p>Get free OPN testnet tokens to start buying property shares on OPNfi.</p>
          </div>
          <div className="faucet-card">
            <div className="faucet-card-title">Network Info</div>
            <div className="faucet-net-grid">
              {[{k:"Network",v:"OPN Testnet"},{k:"Chain ID",v:"984"},{k:"RPC URL",v:"testnet-rpc.iopn.tech"},{k:"Symbol",v:"OPN"}].map(r=>(
                <div className="faucet-net-item" key={r.k}>
                  <div className="faucet-info-key">{r.k}</div>
                  <div className="faucet-info-val">{r.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="faucet-card">
            <div className="faucet-card-title">How to get OPN tokens</div>
            <div className="faucet-steps">
              {[
                {n:1,t:<>Connect your wallet using the <strong>Connect Wallet</strong> button above</>},
                {n:2,t:<>Click <strong>Open Faucet</strong> and paste your wallet address</>},
                {n:3,t:<>Request tokens and wait for confirmation</>},
                {n:4,t:<>Return to <strong>Market</strong> and buy property shares</>},
              ].map(s=>(<div className="faucet-step" key={s.n}><span className="faucet-step-num">{s.n}</span><span className="faucet-step-text">{s.t}</span></div>))}
            </div>
          </div>
          {wallet&&<div className="faucet-card" style={{textAlign:"center"}}>
            <div className="faucet-card-title">Your Wallet Address</div>
            <div style={{background:"var(--bg3)",borderRadius:10,padding:"14px 18px",marginBottom:16,wordBreak:"break-all",fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:"var(--cyan)",letterSpacing:"0.3px"}}>{wallet}</div>
            <button className="btn-secondary" style={{fontSize:13,padding:"8px 20px",margin:"0 auto"}} onClick={()=>navigator.clipboard.writeText(wallet)}>Copy Address</button>
          </div>}
          <a className="faucet-btn" href="https://faucet.iopn.tech/" target="_blank">Open Faucet ↗</a>
          <div className="faucet-note" style={{marginTop:20}}>
            <div><div className="faucet-note-title">💡 Tip</div><div className="faucet-note-desc">The cheapest property share starts at <strong>0.001 OPN</strong> — even a small drip from the faucet is enough to start testing.</div></div>
          </div>
        </div>
      </div>}

      {tab==="portfolio"&&<div className="page">
        <div className="page-inner">
          <div className="page-title">Portfolio</div>
          <div className="page-sub">Property shares you own on-chain</div>
          {!wallet&&<div className="empty"><div className="empty-title">Please connect your wallet first</div></div>}
          <div className="grid2">
            {props.filter(p=>shares[p.id]>0).map(p=>(
              <div className="port-card" key={p.id} onClick={()=>openDetail(p)} style={{cursor:"pointer"}}>
                <div className="port-head">
                  <div><div className="card-title">{p.name}</div><div className="card-loc">{p.location}</div></div>
                  <div><div className="port-num">{shares[p.id]}</div><div className="port-num-label">shares</div></div>
                </div>
                <div className="port-info">
                  <div className="port-info-row"><span className="port-info-key">Investment Value</span><span>{(parseFloat(fmt(p.pricePerShare))*shares[p.id]).toFixed(4)} OPN</span></div>
                  <div className="port-info-row"><span className="port-info-key">Ownership</span><span>{((shares[p.id]/Number(p.totalShares))*100).toFixed(2)}%</span></div>
                </div>
                <div className="card-view-btn" style={{marginTop:12}}>View Details →</div>
              </div>
            ))}
            {wallet&&props.filter(p=>shares[p.id]>0).length===0&&<div className="empty" style={{gridColumn:"span 2"}}><div className="empty-title">No shares yet</div><div className="empty-sub">Buy some in the Market tab!</div></div>}
          </div>
        </div>
      </div>}

      {tab==="admin"&&isOwner&&<div className="page">
        <div className="page-inner" style={{maxWidth:560}}>
          <div className="page-title">Admin Panel</div>
          <div className="page-sub">List a new property to the smart contract on-chain</div>
          <div className="admin-card">
            {[{k:"name",l:"Property Name",p:"Menteng Residence"},{k:"location",l:"Location",p:"Central Jakarta"},{k:"totalValue",l:"Total Value (OPN)",p:"100"},{k:"totalShares",l:"Total Shares",p:"1000"},{k:"pricePerShare",l:"Price per Share (OPN)",p:"0.1"}].map(f=>(
              <div className="form-group" key={f.k}>
                <label className="form-label">{f.l}</label>
                <input className="form-input" type="text" placeholder={f.p} value={form[f.k]} onChange={e=>setForm(lf=>({...lf,[f.k]:e.target.value}))}/>
              </div>
            ))}
            <button className="btn-list" onClick={listProp} disabled={tx.list==="pending"}>
              {tx.list==="pending"?"Submitting...":(tx.list==="success"?"✓ Listed!":(tx.list==="error"?"✗ Failed":"List Property On-Chain"))}
            </button>
          </div>
        </div>
      </div>}

      {tab==="about"&&<div className="page">
        <div className="about-wrap">
          <div className="about-hero">
            <div className="about-badge">🌐 Internet of People</div>
            <h1>Built on <span className="grad">IOPn</span></h1>
            <p>OPNfi is a Real World Asset platform built on OPN Chain — the sovereign Layer 1 blockchain powering the Internet of People ecosystem.</p>
          </div>
          <div className="about-grid">
            {[
              {icon:"⛓️",title:"OPN Chain",desc:"EVM-compatible Layer 1 built on Cosmos SDK. 10,000+ TPS, sub-second finality, 300x Ethereum throughput.",link:"https://chain.iopn.io",label:"Learn more"},
              {icon:"🪪",title:"Neo ID",desc:"Soulbound smart NFTs representing on-chain identity and credentials. Your portable profile anchored in reputation.",link:"https://iopn.io",label:"Learn more"},
              {icon:"🏠",title:"OPNfi RWA",desc:"Fractional real estate ownership on OPN Chain. Buy property shares via smart contract — fully on-chain.",link:"https://testnet.iopn.tech/address/"+CA,label:"View Contract"},
              {icon:"🔄",title:"OPN Swap",desc:"Decentralized exchange native to IOPn Network. Swap tokens permissionlessly with low fees on OPN Chain.",link:"https://swap.iopn.tech",label:"Open Swap"},
              {icon:"🎓",title:"IOPn Learn",desc:"Master OPN Chain fundamentals through interactive lessons and earn OPN rewards while learning.",link:"https://learn.iopn.tech",label:"Start Learning"},
              {icon:"🏗️",title:"Builders Program",desc:"Season 1 · DeFi & Open Finance hackathon. Build on OPN Chain and win rewards for your project.",link:"https://builders.iopn.tech",label:"Join Now"},
            ].map(c=>(
              <div className="about-card" key={c.title}>
                <div className="about-card-icon">{c.icon}</div>
                <div className="about-card-title">{c.title}</div>
                <div className="about-card-desc">{c.desc}</div>
                <a className="about-card-link" href={c.link} target="_blank">{c.label} ↗</a>
              </div>
            ))}
          </div>
          <div className="about-links-section">
            <div className="about-links-title">Official Resources</div>
            <div className="about-links-grid">
              {[
                {icon:"📖",label:"Documentation",url:"https://iopn.gitbook.io/iopn"},
                {icon:"🔍",label:"Block Explorer",url:"https://testnet.iopn.tech"},
                {icon:"💧",label:"Testnet Faucet",url:"https://faucet.iopn.tech"},
                {icon:"🔄",label:"OPN Swap",url:"https://swap.iopn.tech"},
                {icon:"🎓",label:"IOPn Learn",url:"https://learn.iopn.tech"},
                {icon:"🏗️",label:"Builders Program",url:"https://builders.iopn.tech"},
                {icon:"🐦",label:"Twitter/X",url:"https://x.com/iopn_io"},
                {icon:"💬",label:"Telegram",url:"https://t.me/iopn_io"},
              ].map(l=>(
                <a className="about-link-item" href={l.url} target="_blank" key={l.label}>
                  <span className="about-link-icon">{l.icon}</span>
                  <span className="about-link-label">{l.label}</span>
                  <span className="about-link-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="about-built">
            <div className="about-built-text">OPNfi is an open-source project built during the IOPn Season 1 · DeFi &amp; Open Finance hackathon.</div>
            <div className="about-built-links">
              <a href="https://github.com/frankxeth/OPNfi" target="_blank" className="btn-secondary" style={{fontSize:13}}>View on GitHub ↗</a>
              <a href="https://builders.iopn.tech" target="_blank" className="btn-primary" style={{fontSize:13}}>OPN Builders ↗</a>
            </div>
          </div>
        </div>
      </div>}

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <Logo size={48} showText={true}/>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <div className="footer-col-title">Contract</div>
                <a className="footer-link" href={"https://testnet.iopn.tech/address/"+CA} target="_blank">{CA.slice(0,10)}...{CA.slice(-6)}</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Network</div>
                <span className="footer-link-plain">OPN Testnet · Chain ID 984</span>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Community</div>
                <div className="footer-socials">
                  <a className="footer-social" href="https://x.com/l1luna_" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span>Build by @l1luna_</span>
                  </a>
                  <a className="footer-social" href="https://t.me/iopn_io" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    <span>Telegram</span>
                  </a>
                  <a className="footer-social" href="https://discord.gg/iopn" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055A19.9 19.9 0 0 0 5.9 21.9a.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                    <span>Discord</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 OPNfi · Built on IOPn</span>
            <span>One chain. One identity. Fully sovereign.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}