<script setup>
defineProps({ variant: { type: String, default: 'landscape' } })
</script>

<template>
  <svg v-if="variant === 'landscape'" class="pixel-scene" viewBox="0 0 640 260" role="img" aria-label="月光下的像素山谷、松林与小屋" shape-rendering="crispEdges">
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#192e35"/><stop offset="1" stop-color="#3a5751"/></linearGradient></defs>
    <path fill="url(#sky)" d="M0 0h640v260H0z"/>
    <g fill="#acccaf"><path d="M49 34h3v3h-3zM178 23h3v3h-3zM290 51h3v3h-3zM397 24h3v3h-3zM574 42h3v3h-3zM363 72h3v3h-3zM242 13h2v2h-2zM610 81h2v2h-2zM88 89h2v2h-2z"/></g>
    <path fill="#eadba0" d="M481 24h24v6h6v24h-6v6h-24v-6h-6V30h6z"/><path fill="#c0c99b" d="M481 30h6v6h-6zm18 18h6v6h-6z"/>
    <path fill="#34504e" d="M0 139h24v-16h24v-20h24V84h32v19h24v20h24v16h40v-20h24v-24h24V74h24v21h24v24h24v20h40v-16h24v-21h24V82h32v20h24v21h24v16h32v-15h24v-24h32V80h24v20h24v24h24v15h48v121H0z"/>
    <path fill="#253e3e" d="M0 171h32v-16h32v-16h32v16h32v16h48v-16h32v-20h32v20h32v16h48v-12h32v-20h32v20h32v12h48v-16h32v-16h32v16h32v16h64v89H0z"/>
    <path fill="#557e68" d="M0 211h112v-8h104v-8h160v8h152v8h112v49H0z"/>
    <path fill="#93b88a" d="M269 203h65v8h-24v8h-20v8h35v8h39v8h49v17H259v-17h-26v-16h25v-8h11z"/>
    <g fill="#18332f"><path d="M38 117h8v16h8v16h8v16h8v16H14v-16h8v-16h8v-16h8zM95 142h8v16h8v16h8v16H79v-16h8v-16h8zM560 111h8v16h8v16h8v16h8v16h8v16h-72v-16h8v-16h8v-16h8v-16h8zM505 148h8v16h8v16h8v16h-40v-16h8v-16h8z"/></g>
    <g fill="#142b27"><path d="M0 214h46v-8h32v8h29v8h45v38H0zM458 236h43v-10h38v-7h43v-8h58v49H458z"/></g>
    <path fill="#523e32" d="M386 166h80v50h-80z"/><path fill="#1c2c29" d="M378 162h16v-8h16v-8h32v8h16v8h16v9h-96z"/><path fill="#a4784d" d="M391 177h70v5h-70zm0 17h70v5h-70z"/>
    <path fill="#f4ca78" d="M398 179h16v16h-16zm36 0h16v16h-16z"/><path fill="#332e29" d="M418 192h12v24h-12z"/><path fill="#847f67" d="M442 139h9v17h-9z"/>
    <g fill="#b9c299" opacity=".35"><path d="M443 126h8v8h-8zm8-14h8v8h-8zm-5-14h8v8h-8z"/></g>
    <g fill="#c7d492"><path d="M168 228h4v4h-4zm24 14h4v4h-4zm-63-8h4v4h-4zm370 9h4v4h-4z"/></g>
  </svg>
  <svg v-else-if="variant === 'garden'" class="pixel-scene" viewBox="0 0 320 160" role="img" aria-label="像素花园与植物" shape-rendering="crispEdges">
    <path fill="#30453a" d="M0 0h320v160H0z"/><path fill="#3d5444" d="M0 112h320v48H0z"/><path fill="#53684e" d="M0 128h320v4H0zm0 20h320v4H0zM45 112h4v48h-4zm65 0h4v48h-4zm65 0h4v48h-4zm65 0h4v48h-4z"/>
    <path fill="#23352f" d="M38 27h244v74H38z"/><path fill="#719172" d="M44 33h232v62H44z"/><path fill="#a5b995" d="M50 39h220v50H50z"/><path fill="#526c52" d="M156 33h6v62h-6zM44 62h232v6H44z"/>
    <g fill="#c79669"><path d="M74 111h38v30H74zM144 104h38v37h-38zM214 115h38v26h-38z"/></g><g fill="#a8cd85"><path d="M88 72h10v39H88zM72 80h16v10H72zm26 9h16v10H98zM157 70h10v34h-10zM143 66h14v17h-14zm24-9h14v20h-14zM227 85h10v30h-10zM215 78h12v17h-12zm22 17h14v10h-14z"/></g><path fill="#e3c87d" d="M151 50h18v18h-18z"/>
  </svg>
  <svg v-else class="pixel-scene" viewBox="0 0 320 160" role="img" aria-label="像素桌面与电脑" shape-rendering="crispEdges">
    <path fill="#3d3b50" d="M0 0h320v160H0z"/><path fill="#514b60" d="M0 0h320v6H0zm0 39h320v3H0zm0 40h320v3H0z"/><path fill="#a38875" d="M27 120h266v12H27z"/><path fill="#695447" d="M39 132h10v28H39zm232 0h10v28h-10z"/>
    <path fill="#b4b9a9" d="M89 31h132v77H89zM143 108h24v12h-24z"/><path fill="#182f33" d="M97 39h116v59H97z"/><path fill="#a9d787" d="M106 49h18v4h-18zm0 9h35v4h-35zm10 9h44v4h-44zm0 9h27v4h-27zm-10 9h18v4h-18z"/><path fill="#d7b87c" d="M149 58h30v4h-30zm19 9h24v4h-24z"/>
    <path fill="#d5c5aa" d="M236 101h20v19h-20zM256 104h8v11h-8z"/><path fill="#739b6c" d="M52 85h12v18H52zm-8-8h8v15h-8zm20-6h8v21h-8z"/><path fill="#c69c78" d="M45 103h29v17H45z"/>
  </svg>
</template>
